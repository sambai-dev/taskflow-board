export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export type ColumnWithTasks = Column & {
  tasks: Task[];
};

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Types for Supabase join results
 * These represent the shape of data returned from nested select queries
 */

// Board info nested in column join
export interface BoardJoinResult {
  id: string;
  title: string;
  user_id: string;
}

// Column with nested board join
export interface ColumnWithBoardJoin {
  title: string;
  board_id: string;
  boards: BoardJoinResult | BoardJoinResult[];
}

// Task with full column and board join (for search/recent tasks)
export interface TaskWithJoins extends Task {
  columns: ColumnWithBoardJoin | ColumnWithBoardJoin[];
}

// Flattened task with board info (after processing joins)
export interface TaskWithBoardInfo extends Task {
  board_title: string;
  board_id: string;
}

export interface TaskWithFullBoardInfo extends Task {
  board_title: string;
  column_title: string;
  board_id: string;
}
