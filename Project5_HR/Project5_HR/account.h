#pragma once
#include <iostream>
#include <string>

using namespace std;

class Account
{
public:
	Account();
	~Account();

private:
	int staffID;
	string password;

};

Account::Account()
{
}

Account::~Account()
{
}