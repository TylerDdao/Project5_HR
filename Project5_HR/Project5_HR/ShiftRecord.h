#pragma once
#include "DateTime.h"
class ShiftRecord
{
public:
	ShiftRecord();

	bool setShiftId(int shiftId);
	bool setStaffId(int staffId);
	bool setInTime(Time inTime);
	bool setOutTime(Time outTime);
	bool setDate(Date date);

	int getShiftId();
	int getStaffId();
	Time getInTime();
	Time getOutTime();
	Date getDate();

	~ShiftRecord();

private:
	int shiftId();
	int staffId();
	Time inTime;
	Time outTime;
	Date date;
};

ShiftRecord::ShiftRecord()
{
}

ShiftRecord::~ShiftRecord()
{
}