#pragma once
#include <iostream>
#include <string>

using namespace std;

/// @brief This is Account Class
class Account
{
public:
	Account();
	~Account();

	/// @brief This is a set staff id function
	/// @param staffId 
	/// @return boolean
	bool setStaffId(int staffId);

	/// @brief This is a set password function
	/// @param password 
	/// @return boolean
	bool setPassword(string password);

	/// @brief This is a set account type function
	/// @param accountType 
	/// @return boolean
	bool setAccountType(string accountType);

	/// @brief This is a get staff id function
	/// @return staffId:int
	int getStaffId();

	/// @brief This is a get password function
	/// @return password:string
	string getPassword();

	/// @brief This is a get account type function
	/// @return accountType:string
	string getAccountType();

private:
	int staffID;
	string password;
	string accountType;
};