#include "Shift.h"

Shift::Shift()
{
	this->shiftId = 0;
	this->startTime = "";
	this, endTime = "";
}

Shift::Shift(int shiftId) {
	this->shiftId = shiftId;
}
bool Shift::setShiftId(int shiftId) {
	this->shiftId = shiftId;
	return true;
}

bool Shift::setStartTime(std::string startTime) {
	this->startTime = startTime;
	return true;
}
bool Shift::setEndTime(std::string endTime) {
	this->endTime = endTime;
	return true;
}

int Shift::getShiftId() {
	return this->shiftId;
}
std::string Shift::getStartTime() {
	return this->startTime;
}
std::string Shift::getEndTime(){
	return this->endTime;
}
Shift::~Shift() {

}