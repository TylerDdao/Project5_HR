#pragma once
#include "DateTime.h"
class Shift
{
public:
	Shift();
	Shift(int shiftId);
	bool setDate(Date date);
	bool setStartTime(Time time);
	bool setEndTime(Time time);

	int getShiftId();
	Date getDate();
	Time getStartTime();
	Time getEndTime();
	~Shift();

private:
	int shiftId;
	Date date;
	Time startTime;
	Time endTime;
};