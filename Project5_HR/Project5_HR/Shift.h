#pragma once
#include "DateTime.h"
#include <string>
class Shift
{
public:
	Shift();
	Shift(int shiftId);
	bool setShiftId(int shiftId);
	bool setStartTime(std::string time);
	bool setEndTime(std::string time);

	int getShiftId();
	std::string getStartTime();
	std::string getEndTime();
	~Shift();

private:
	int shiftId;
	std::string startTime;
	std::string endTime;
};