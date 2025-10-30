#include "ShiftRecord.h"


ShiftRecord::ShiftRecord()
{
}

bool ShiftRecord::setShiftId(int shiftId)
{
	return false;
}

bool ShiftRecord::setStaffId(int staffId)
{
	return false;
}

bool ShiftRecord::setInTime(Time inTime)
{
	return false;
}

bool ShiftRecord::setOutTime(Time outTime)
{
	return false;
}

bool ShiftRecord::setDate(Date date)
{
	return false;
}

int ShiftRecord::getShiftId()
{
	return 0;
}

int ShiftRecord::getStaffId()
{
	return 0;
}

Time ShiftRecord::getInTime()
{
	return Time();
}

Time ShiftRecord::getOutTime()
{
	return Time();
}

Date ShiftRecord::getDate()
{
	return Date();
}

ShiftRecord::~ShiftRecord()
{
}