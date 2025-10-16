#pragma once

/// @brief This is Payroll Class
class Payroll
{
public:
	Payroll();

	/// @brief This is a set staff id function
	/// @param staffId 
	/// @return boolean
	bool setStaffId(int staffId);

	/// @brief This is a set hour worked function
	/// @param hour worked 
	/// @return boolean
	bool setHourWorked(float hourWorked);

	/// @brief This is a set wage rate function
	/// @param wage rate
	/// @return boolean
	bool setWageRate(float wageRate);

	/// @brief This is a set bonus function
	/// @param bonus 
	/// @return boolean
	bool setBonus(float bonus);

	/// @brief This is a set deduction function
	/// @param deduction 
	/// @return boolean
	bool setDeduction(float deduction);

	/// @brief This is a set total earned function
	/// @param total earned 
	/// @return boolean
	bool setTotalEarned();

	/// @brief This is a get staff id function
	/// @return staffId:int
	int getStaffId();

	/// @brief This is a get wage rate function
	/// @return wageRage:float
	float getWageRate();

	/// @brief This is a get hour worked function
	/// @return hourWorked:float
	float getHourWorked();

	/// @brief This is a get bonus function
	/// @return bonus:float
	float getBonus();

	/// @brief This is a get deduction function
	/// @return deduction:float
	float getDeduction();

	/// @brief This is a get total earned function
	/// @return totalEarned:float
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