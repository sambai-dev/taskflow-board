import {
  Column,
  Board,
  Task,
  TaskWithJoins,
  TaskWithBoardInfo,
  TaskWithFullBoardInfo,
  ColumnWithBoardJoin,
} from "@/lib/supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) throw error;
    return data;
  },

  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Fetch boards with task count using Supabase joins
  async getBoardsWithTaskCount(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<
    (Board & {
      taskCount: number;
      columnCounts: { id: string; title: string; count: number }[];
    })[]
  > {
    // Step 1: Get all boards for the user
    const { data: boards, error: boardsError } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (boardsError) throw boardsError;
    if (!boards || boards.length === 0) return [];

    // Step 2: For each board, count tasks across all columns
    const boardsWithCounts = await Promise.all(
      boards.map(async (board) => {
        // Get all columns for this board
        const { data: columns, error: columnsError } = await supabase
          .from("columns")
          .select("id, title")
          .eq("board_id", board.id)
          .order("sort_order", { ascending: true });

        if (columnsError) {
          console.error("Error fetching columns:", columnsError);
          return { ...board, taskCount: 0, columnCounts: [] };
        }

        if (!columns || columns.length === 0) {
          return { ...board, taskCount: 0, columnCounts: [] };
        }

        const columnIds = columns.map((col) => col.id);

        // Get all tasks for these columns (lightweight fetch)
        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("id, column_id")
          .in("column_id", columnIds);

        if (tasksError) {
          console.error("Error counting tasks:", tasksError);
          return { ...board, taskCount: 0, columnCounts: [] };
        }

        // Calculate per-column counts
        const columnCounts = columns.map((col) => {
          const count = tasks
            ? tasks.filter((t) => t.column_id === col.id).length
            : 0;
          return { id: col.id, title: col.title, count };
        });

        // Calculate total task count (including "Done")
        const totalTaskCount = tasks ? tasks.length : 0;

        return { ...board, taskCount: totalTaskCount, columnCounts };
      }),
    );

    return boardsWithCounts;
  },

  async createTask(
    supabase: SupabaseClient,
    task: Omit<Task, "id" | "created_at" | "updated_at">,
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) {
      console.error("Error creating board:", error);
      throw error;
    }
    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createColumn(
    supabase: SupabaseClient,
    column: Omit<Column, "id" | "created_at">,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateColumn(
    supabase: SupabaseClient,
    columnId: string,
    updates: Partial<Column>,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .update(updates)
      .eq("id", columnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBoard(supabase: SupabaseClient, boardId: string): Promise<void> {
    // 1. Get all columns for this board to delete their tasks
    const { data: columns } = await supabase
      .from("columns")
      .select("id")
      .eq("board_id", boardId);

    if (columns && columns.length > 0) {
      const columnIds = columns.map((col) => col.id);
      // 2. Delete all tasks in these columns
      const { error: tasksError } = await supabase
        .from("tasks")
        .delete()
        .in("column_id", columnIds);

      if (tasksError) throw tasksError;

      // 3. Delete the columns
      const { error: columnsError } = await supabase
        .from("columns")
        .delete()
        .eq("board_id", boardId);

      if (columnsError) throw columnsError;
    }

    // 4. Delete the board
    const { error } = await supabase.from("boards").delete().eq("id", boardId);
    if (error) throw error;
  },

  async bulkDeleteBoards(
    supabase: SupabaseClient,
    boardIds: string[],
  ): Promise<void> {
    if (boardIds.length === 0) return;

    // 1. Get all columns for these boards
    const { data: columns } = await supabase
      .from("columns")
      .select("id")
      .in("board_id", boardIds);

    if (columns && columns.length > 0) {
      const columnIds = columns.map((col) => col.id);
      // 2. Delete all tasks in these columns
      const { error: tasksError } = await supabase
        .from("tasks")
        .delete()
        .in("column_id", columnIds);

      if (tasksError) throw tasksError;

      // 3. Delete the columns
      const { error: columnsError } = await supabase
        .from("columns")
        .delete()
        .in("board_id", boardIds);

      if (columnsError) throw columnsError;
    }

    // 4. Delete the boards
    const { error } = await supabase.from("boards").delete().in("id", boardIds);
    if (error) throw error;
  },
};

export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createColumn(
    supabase: SupabaseClient,
    column: Omit<Column, "id" | "created_at">,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateColumnTitle(
    supabase: SupabaseClient,
    columnId: string,
    title: string,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .update({ title })
      .eq("id", columnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteColumn(
    supabase: SupabaseClient,
    columnId: string,
  ): Promise<void> {
    // 1. Delete all tasks in this column
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("column_id", columnId);

    if (tasksError) throw tasksError;

    // 2. Delete the column
    const { error } = await supabase
      .from("columns")
      .delete()
      .eq("id", columnId);
    if (error) throw error;
  },
};

export const taskService = {
  async getTasksByBoard(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        columns!inner(board_id)
        `,
      )
      .eq("columns.board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async moveTask(
    supabase: SupabaseClient,
    taskId: string,
    newColumnId: string,
    newOrder: number,
  ) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        column_id: newColumnId,
        sort_order: newOrder,
      })
      .eq("id", taskId);

    if (error) throw error;
    return data;
  },

  async updateTasksOrder(
    supabase: SupabaseClient,
    updates: { id: string; column_id: string; sort_order: number }[],
  ) {
    // Using Promise.all for parallel updates to ensure reliability
    // upsert with partial data can be problematic depending on RLS and constraints
    const promises = updates.map((update) =>
      supabase
        .from("tasks")
        .update({
          column_id: update.column_id,
          sort_order: update.sort_order,
        })
        .eq("id", update.id),
    );

    const results = await Promise.all(promises);

    // Check for errors in any of the requests
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) throw firstError;
  },

  async deleteTask(supabase: SupabaseClient, taskId: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
  },

  async getRecentTasks(
    supabase: SupabaseClient,
    userId: string,
    limit: number = 5,
  ): Promise<
    (Task & { board_title: string; column_title: string; board_id: string })[]
  > {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        columns!inner (
          title,
          boards!inner (
            id,
            title,
            user_id
          )
        )
      `,
      )
      .eq("columns.boards.user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return ((data as TaskWithJoins[]) || []).map(
      (task): TaskWithFullBoardInfo => {
        const col = Array.isArray(task.columns)
          ? task.columns[0]
          : task.columns;
        const board = Array.isArray(col.boards) ? col.boards[0] : col.boards;
        // Destructure to exclude join data from the result
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { columns, ...taskData } = task;
        return {
          ...taskData,
          board_title: board.title,
          column_title: col.title,
          board_id: board.id,
        };
      },
    );
  },
};

export const dashboardService = {
  async getTaskStats(supabase: SupabaseClient, userId: string) {
    // 1. Fetch all boards for user to get IDs
    const { data: boards } = await supabase
      .from("boards")
      .select("id, title")
      .eq("user_id", userId);

    const boardIds = boards?.map((b) => b.id) || [];

    // 2. Fetch all columns (to identify "Done" columns if needed, though we might just rely on status string if it was standardized, but here we have to guess or check column names.
    //    Actually, earlier code used "Done" title. We will assume column title "Done" implies completed.)
    //    Also fetch all tasks.

    // We can do a single query for tasks with their columns
    const { data: tasks } = await supabase
      .from("tasks")
      .select(
        `
        id,
        created_at,
        priority,
        column_id,
        columns!inner (
          title,
          board_id
        )
      `,
      )
      .in("columns.board_id", boardIds);

    const allTasks = tasks || [];
    const totalTasks = allTasks.length;

    // Calculate Stats
    const totalBoards = boards?.length || 0;

    // Active boards: boards with at least one task
    const activeBoardIds = new Set(
      allTasks.map(
        (t: { columns: { board_id: string } | { board_id: string }[] }) =>
          Array.isArray(t.columns) ? t.columns[0].board_id : t.columns.board_id,
      ),
    );
    const activeBoards = activeBoardIds.size;

    // Completed tasks (Column title is "Done")
    const completedTasks = allTasks.filter(
      (t: { columns: { title: string } | { title: string }[] }) => {
        const col = Array.isArray(t.columns) ? t.columns[0] : t.columns;
        return col.title === "Done";
      },
    ).length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Chart Data: Tasks by Status
    const statusCounts: Record<string, number> = {};
    allTasks.forEach(
      (t: { columns: { title: string } | { title: string }[] }) => {
        const col = Array.isArray(t.columns) ? t.columns[0] : t.columns;
        const status = col.title;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      },
    );

    const tasksByStatus = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Chart Data: Tasks Created Last 30 Days
    // Need to fill in gaps.
    const last30DaysMap = new Map<string, number>();
    const today = new Date();

    // Initialize map with 0 for last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      last30DaysMap.set(dateStr, 0);
    }

    // Fill with actual data
    allTasks.forEach((t) => {
      const dateStr = new Date(t.created_at).toISOString().split("T")[0];
      if (last30DaysMap.has(dateStr)) {
        last30DaysMap.set(dateStr, (last30DaysMap.get(dateStr) || 0) + 1);
      }
    });

    const tasksCreatedLast30Days = Array.from(last30DaysMap.entries()).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

    return {
      totalBoards,
      activeBoards,
      totalTasks,
      completionRate: Math.round(completionRate), // Round to integer
      tasksByStatus,
      tasksCreatedLast30Days,
    };
  },
};

export const boardDataService = {
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      columnService.getColumns(supabase, boardId),
    ]);

    if (!board) throw new Error("Board not found");

    const tasks = await taskService.getTasksByBoard(supabase, boardId);

    const columnsWithTasks = columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column_id === column.id),
    }));

    return {
      board,
      columnsWithTasks,
    };
  },

  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    },
  ): Promise<Board> {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-blue-500",
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        }),
      ),
    );

    return board;
  },

  async searchGlobal(
    supabase: SupabaseClient,
    userId: string,
    query: string,
  ): Promise<{
    boards: Board[];
    tasks: (Task & { board_title: string; board_id: string })[];
  }> {
    if (!query || query.length < 2) return { boards: [], tasks: [] };

    const searchTerm = `%${query}%`;

    // Search Boards
    const { data: boards } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .ilike("title", searchTerm)
      .limit(5);

    // Search Tasks (joining with boards to get title and ID for navigation)
    const { data: tasks } = await supabase
      .from("tasks")
      .select(
        `
        *,
        columns!inner (
          boards!inner (
            id,
            title,
            user_id
          )
        )
      `,
      )
      .eq("columns.boards.user_id", userId)
      .ilike("title", searchTerm)
      .limit(5);

    const formattedTasks: TaskWithBoardInfo[] = (
      (tasks as TaskWithJoins[]) || []
    ).map((task) => {
      const col = Array.isArray(task.columns) ? task.columns[0] : task.columns;
      const board = Array.isArray(col.boards) ? col.boards[0] : col.boards;
      // Destructure to exclude join data from the result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { columns, ...taskData } = task;
      return {
        ...taskData,
        board_title: board.title,
        board_id: board.id,
      };
    });

    return {
      boards: boards || [],
      tasks: formattedTasks,
    };
  },
};
