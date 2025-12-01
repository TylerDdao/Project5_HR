#include "DateTime.h"

Time::Time()
{
	this->hour = 0;
	this->minute = 0;
}

Time::~Time()
{
}

bool Time::setTime(int hour, int minute) {
	return true;
}
bool Time::setHour(int hour) {
	return true;
}
bool Time::setMinute(int minute) {
	return true;
}

int Time::getHour() {
	return 0;
}
int Time::getMinute() {
	return 0;
}



Date::Date() {
	this->day = 0;
	this->month = 0;
	this->year = 0;
}

bool Date::setDate(int day, int month, int year) {
	return true;
}
bool Date::setDay(int day) {
	return true;
}
bool Date::setMonth(int month) {
	return true;
}
bool Date::setYear(int year) {
	return true;
}

int Date::getDay() {
	return 0;
}
int Date::getMonth() {
	return 0;
}
int Date::getYear() {
	return 0;
}
Date::~Date() {

}