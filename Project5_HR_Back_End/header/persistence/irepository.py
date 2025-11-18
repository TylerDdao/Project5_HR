from abc import ABC, abstractmethod

class IRepository(ABC):
    @abstractmethod
    def save_to_file(self, data: str, filename: str) -> None:
        """Save data to a file."""
        pass

    @abstractmethod
    def load_from_file(self, filename: str) -> str:
        """Load and return data from a file."""
        pass

    @abstractmethod
    def file_exists(self, filename: str) -> bool:
        """Check if a file exists."""
        pass
