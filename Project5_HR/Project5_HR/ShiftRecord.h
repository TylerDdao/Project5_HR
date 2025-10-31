#pragma once
#include "DateTime.h"
#include <string>
class ShiftRecord
{
public:
	ShiftRecord();
	ShiftRecord(int staffId, int shiftId, std::string checkIn, std::string checkOut);

	bool setShiftId(int shiftId);
	bool setStaffId(int staffId);
	bool setCheckIn(std::string checkIn);
	bool setCheckOut(std::string checkOut);


	int getShiftId();
	int getStaffId();
	std::string getCheckIn();
	std::string getCheckOut();

	~ShiftRecord();

private:
	int shiftId;
	int staffId;
	std::string checkIn;
	std::string checkOut;
};
