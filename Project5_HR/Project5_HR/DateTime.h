#pragma once

/// @brief 
class Time
{
public:
	Time();
	bool setTime(int hour, int minute);
	bool setHour(int hour);
	bool setMinute(int minute);

	int getHour();
	int getMinute();
	~Time();

private:
	int hour;
	int minute;

};

/// @brief 
class Date
{
public:
	Date();
	bool setDate(int day, int month, int year);
	bool setDay(int day);
	bool setMonth(int month);
	bool setYear(int year);

	int getDay();
	int getMonth();
	int getYear();
	~Date();

private:
	int day;
	int month;
	int year;
};
