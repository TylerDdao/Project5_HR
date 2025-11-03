#include "Account.h"

Account::Account()
{
	this->staffID = 0;
	this->password = "";
	this->accountType = "";
}

Account::Account(int accountId, int staffId, string password, string accountType)
{
	this->accountType = accountType;
	this->staffID = staffId;
	this->accountId = accountId;
	this->password = password;
}

Account::~Account()
{
}

bool Account::setAccountId(int accountId)
{
	this->accountId = accountId;
	return true;
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

int Account::getAccountId()
{
	return this->accountId;
}

int Account::getStaffId()
{
	return this->staffID;
}

string Account::getPassword()
{
	return this->password;
}

string Account::getAccountType()
{
	return this->accountType;
}