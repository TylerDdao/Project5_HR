#pragma once

class Payroll
{
public:
	Payroll();

	bool setStaff(int staffId);
	bool setHourWorked(float hourWorked);
	bool setWageRate(float wageRate);
	bool setBonus(float bonus);
	bool setDeduction(float deduction);
	bool setTotalEarned();

	int getStaffId();
	float getWageRate();
	float getHourWorked();
	float getBonus();
	float getDeduction();
	float getTotalEarned();

	~Payroll();

private:
	int staffId;
	float wageRate;
	float hourWorked;
	float bonus;
	float totalEarned;
	float deduction;
};

Payroll::Payroll()
{
}

Payroll::~Payroll()
{
}