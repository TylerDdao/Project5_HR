class Shift:
    """
    @brief Represents work shift within scheduling system.
        The Shift class store information about single schedules shift, with
        -> Unique shift ID
        -> Shift start time
        -> Shift end time
        -> List of staff IDs assigned to shift

        This class provide simple setter and getter methods so that shift data
        can be created, modified and retrieved by other components such as scheduling,
        payroll and database layers.

    """

    def __init__(self, shift_id=0, start_time="", end_time="", staffs=[]):
        self._shift_id = shift_id
        self._start_time = start_time
        self._end_time = end_time
        self._staffs: list[int] = staffs

    def set_shift_id(self, shift_id: int) -> bool:
        self._shift_id = shift_id

        return True

    def set_start_time(self, start_time: str) -> bool:
        self._start_time = start_time
        return True

    def set_end_time(self, end_time: str) -> bool:
        self._end_time = end_time
        return True

    def set_staffs(self, staffs: list[int]) -> bool:
        self._staffs = staffs
        return True

    def get_shift_id(self) -> int:
        return self._shift_id

    def get_start_time(self) -> str:
        return self._start_time

    def get_end_time(self) -> str:
        return self._end_time

    def get_staffs(self) -> list[int]:
        return self._staffs
