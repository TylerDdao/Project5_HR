#include "Payroll.h"

using namespace std;

Payroll::Payroll()
{
	this->payrollId = 0;
	this->staffId = 0;
	this->wageRate = 0;
	this->hourWorked = 0;
	this->bonus = 0;
	this->totalEarned = 0;
	this->deduction = 0;
}

Payroll::Payroll(int staffId, float wageRate, float hourWorked, float bonus, float deduction) {
	this->payrollId = 0;
	this->staffId = staffId;
	this->wageRate = wageRate;
	this->hourWorked = hourWorked;
	this->bonus = bonus;
	this->deduction = deduction;
	this->totalEarned = (this->hourWorked * this->wageRate) + this->bonus - this->deduction;
}

bool Payroll::setPayrollId(int payrollId)
{
	this->payrollId = payrollId;
	return true;
}

bool Payroll::setStaffId(int staffId)
{
	this->staffId = staffId;
	return true;
}

bool Payroll::setHourWorked(float hourWorked)
{
	this->hourWorked = hourWorked;
	return true;
}

inline bool Payroll::setWageRate(float wageRate)
{
	this->wageRate = wageRate;
	return true;
}

bool Payroll::setBonus(float bonus)
{
	this->bonus = bonus;
	return true;
}

bool Payroll::setDeduction(float deduction)
{
	this->deduction = deduction;
	return true;
}

bool Payroll::setTotalEarned()
{
	this->totalEarned = (this->hourWorked * this->wageRate) + this->bonus + this->deduction;
	return true;
}

int Payroll::getPayrollId()
{
	return this->payrollId;
}

int Payroll::getStaffId()
{
	return this->staffId;
}

float Payroll::getWageRate()
{
	return this->wageRate;
}

float Payroll::getHourWorked()
{
	return this->hourWorked;
}

float Payroll::getBonus()
{
	return this->bonus;
}

float Payroll::getDeduction()
{
	return this->deduction;
}

float Payroll::getTotalEarned()
{
	return this->totalEarned;
}

Payroll::~Payroll()
{
}