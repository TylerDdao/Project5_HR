#include "ShiftRecord.h"


ShiftRecord::ShiftRecord()
{
	this->staffId = 0;
	this->shiftId = 0;
	this->checkIn = "";
	this->checkOut = "";
}

ShiftRecord::ShiftRecord(int staffId, int shiftId, std::string checkIn, std::string checkOut) {
	this->staffId = staffId;
	this->shiftId = shiftId;
	this->checkIn = checkIn;
	this->checkOut = checkOut;
}

bool ShiftRecord::setShiftId(int shiftId)
{
	this->shiftId = shiftId;
	return true;
}

bool ShiftRecord::setStaffId(int staffId)
{
	this->staffId = staffId;
	return true;
}

bool ShiftRecord::setCheckIn(std::string checkIn)
{
	this->checkIn = checkIn;
	return true;
}

bool ShiftRecord::setCheckOut(std::string checkOut)
{
	this->checkOut = checkOut;
	return true;
}

int ShiftRecord::getShiftId()
{
	return 0;
}

int ShiftRecord::getStaffId()
{
	return 0;
}

std::string ShiftRecord::getCheckIn()
{
	return this->checkIn;
}

std::string ShiftRecord::getCheckOut()
{
	return this->checkOut;
}

ShiftRecord::~ShiftRecord()
{
}