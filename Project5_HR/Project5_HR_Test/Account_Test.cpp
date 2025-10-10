//#include "pch.h"
#include "CppUnitTest.h"
#include "../Project5_HR/account.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace Account_Test
{
	TEST_CLASS(Account_Test)
	{
	public:

		TEST_METHOD(SetStaffId_Test_1)
		{
			Account a;
			a.setStaffId(9999);
			Assert::AreEqual(9999, a.getStaffId());
		}
		TEST_METHOD(SetPassword_Test_2)
		{
			Account a;
			string password = "My_Password@123";
			a.setPassword(password);
			Assert::AreEqual(password, a.getPassword());
		}
		TEST_METHOD(SetAccountType_Test_3)
		{
			Account a;
			string accountType = "Employee";
			a.setAccountType(accountType);
			Assert::AreEqual(accountType, a.getAccountType());
		}
	};
}
