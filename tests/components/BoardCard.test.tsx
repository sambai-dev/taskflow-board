import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardCard } from "@/components/BoardCard";

/**
 * BoardCard Component Tests
 *
 * Tests the individual board cards shown in the dashboard, covering
 * rendering, task count displays, and interactive elements.
 */

// --- Helpers & Mocks ---

// Create a mock board that matches BoardWithTaskCount interface
function createMockBoardWithTaskCount(overrides: Record<string, unknown> = {}) {
  return {
    id: "board-1",
    title: "Test Board",
    description: "A test board description",
    color: "bg-blue-500",
    user_id: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    taskCount: 5,
    columnCounts: [
      { id: "col-1", title: "To Do", count: 2 },
      { id: "col-2", title: "In Progress", count: 2 },
      { id: "col-3", title: "Done", count: 1 },
    ],
    ...overrides,
  };
}

describe("BoardCard", () => {
  // --- Setup ---
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Rendering Tests ---
  describe("Rendering", () => {
    it("renders board title", () => {
      const board = createMockBoardWithTaskCount({ title: "Project Board" });

      render(<BoardCard board={board} />);

      expect(screen.getByText("Project Board")).toBeInTheDocument();
    });

    it("renders board description", () => {
      const board = createMockBoardWithTaskCount({
        description: "Board description text",
      });

      render(<BoardCard board={board} />);

      expect(screen.getByText("Board description text")).toBeInTheDocument();
    });

    it("does not render description when null", () => {
      const board = createMockBoardWithTaskCount({ description: null });

      render(<BoardCard board={board} />);

      // No description should be rendered
      expect(
        screen.queryByText("Board description text"),
      ).not.toBeInTheDocument();
    });

    it("renders board color indicator", () => {
      const board = createMockBoardWithTaskCount({ color: "bg-green-500" });

      render(<BoardCard board={board} />);

      // The color indicator should be present
      const colorIndicator = document.querySelector(".bg-green-500");
      expect(colorIndicator).toBeInTheDocument();
    });
  });

  // --- Task & Column Count Tests ---
  describe("Column Counts", () => {
    it("displays column task counts", () => {
      const board = createMockBoardWithTaskCount({
        columnCounts: [
          { id: "col-1", title: "To Do", count: 3 },
          { id: "col-2", title: "In Progress", count: 2 },
          { id: "col-3", title: "Done", count: 5 },
        ],
      });

      render(<BoardCard board={board} />);

      // Should show column counts
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it('displays "No tasks" when no columns have tasks', () => {
      const board = createMockBoardWithTaskCount({
        columnCounts: [],
      });

      render(<BoardCard board={board} />);

      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("shows +N for additional columns beyond 4", () => {
      const board = createMockBoardWithTaskCount({
        columnCounts: [
          { id: "col-1", title: "To Do", count: 1 },
          { id: "col-2", title: "In Progress", count: 1 },
          { id: "col-3", title: "Review", count: 1 },
          { id: "col-4", title: "Done", count: 1 },
          { id: "col-5", title: "Archive", count: 1 },
        ],
      });

      render(<BoardCard board={board} />);

      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  // --- Interactive Elements ---
  describe("Delete Button", () => {
    it("shows delete button when onDelete is provided", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByRole("button");
      expect(deleteButton).toBeInTheDocument();
    });

    it("does not show delete button when onDelete is not provided", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByRole("button");
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  describe("New Badge", () => {
    it("shows New badge when isNew is true", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} isNew={true} />);

      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("does not show New badge when isNew is false", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} isNew={false} />);

      expect(screen.queryByText("New")).not.toBeInTheDocument();
    });
  });

  // --- Date & Time Formatting ---
  describe("Dates", () => {
    it("displays created date with relative time", () => {
      const board = createMockBoardWithTaskCount({
        created_at: new Date().toISOString(), // Use current time for predictable "less than a minute ago"
      });

      render(<BoardCard board={board} />);

      // Component uses formatDistanceToNow which shows relative time
      expect(screen.getByText(/Created/)).toBeInTheDocument();
    });

    it("shows Created prefix for date display", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} />);

      // Should show "Created X time ago" format
      expect(screen.getByText(/Created.*ago/)).toBeInTheDocument();
    });
  });

  // --- CSS & Styling ---
  describe("Styling", () => {
    it("applies hover and group classes for styling", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} />);

      const card = screen.getByText(board.title).closest(".group");
      expect(card).toBeInTheDocument();
    });

    it("applies ring styling when isNew is true", () => {
      const board = createMockBoardWithTaskCount();

      render(<BoardCard board={board} isNew={true} />);

      const card = screen.getByText(board.title).closest(".ring-2");
      expect(card).toBeInTheDocument();
    });
  });
});
