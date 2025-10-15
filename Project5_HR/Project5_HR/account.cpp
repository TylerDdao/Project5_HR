#include "Account.h"

Account::Account()
{
	this->staffID = NULL;
	this->password = "";
	this->accountType = "";
}

Account::~Account()
{
}

bool Account::setStaffId(int staffId)
{
	this->staffID = staffId;
	return true;
}

bool Account::setPassword(string password)
{
	this->password = password;
	return true;
}

bool Account::setAccountType(string accountType)
{
	this->accountType = accountType;
	return true;
}

int Account::getStaffId()
{
	return staffID;
}

string Account::getPassword()
{
	return password;
}

string Account::getAccountType()
{
	return accountType;
}