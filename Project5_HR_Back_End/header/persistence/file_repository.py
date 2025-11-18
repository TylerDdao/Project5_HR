import os
from typing import List


class FileRepository:
    """
    A file-based repository that handles saving/loading text data.
    Mirrors the behavior of the C++ FileRepository class.
    """

    def __init__(self):
        pass

    def SaveToFile(self, data: str, filename: str) -> None:
        """Save raw text data to a file."""
        try:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(data)
        except Exception as e:
            print(f"Error: Cannot open file {filename} for writing. ({e})")

    def LoadFromFile(self, filename: str) -> str:
        """Load entire file contents as a string."""
        if not os.path.isfile(filename):
            return ""
        try:
            with open(filename, "r", encoding="utf-8") as f:
                return f.read()
        except Exception:
            return ""

    def FileExists(self, filename: str) -> bool:
        """Check if a file exists."""
        return os.path.isfile(filename)

    def ReadLines(self, filename: str) -> List[str]:
        """Read file lines into a list of strings, skipping empty lines."""
        lines = []
        if not os.path.isfile(filename):
            return lines

        try:
            with open(filename, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        lines.append(line)
        except Exception:
            pass

        return lines

    def WriteLines(self, lines: List[str], filename: str) -> None:
        """Write a list of strings to a file, each on a new line."""
        try:
            with open(filename, "w", encoding="utf-8") as f:
                for line in lines:
                    f.write(line + "\n")
        except Exception as e:
            print(f"Error: Cannot open file {filename} for writing. ({e})")
