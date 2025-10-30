#include "Shift.h"

//Shift::Shift() {
//
//}
Shift::Shift(int shiftId) {
	this->shiftId = shiftId;
}
bool Shift::setDate(Date date) {
	return true;
}
bool Shift::setStartTime(Time time) {
	return true;
}
bool Shift::setEndTime(Time time) {
	return true;
}

int Shift::getShiftId() {
	return 0;
}
Date Shift::getDate() {
	return this->date;
}
Time Shift::getStartTime() {
	return this->startTime;
}
Time Shift::getEndTime(){
	return this->endTime;
}
Shift::~Shift() {

}