//#include "pch.h"
#include "CppUnitTest.h"
#include "../Project5_HR/Employee.h"
#include "../Project5_HR/EmployeeInfoManagement.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace Project5HRTest
{
	TEST_CLASS(Project5HRTest)
	{
	public:
		
		/*TEST_METHOD(TestAdd)
		{
			int result = minus(7, 1);
			Assert::AreEqual(6, result);
		}*/

		TEST_METHOD(TestCase1_InitializeConstructor)
		{
			Employee e(1, "Ying", "Manager", "123-456-7891", "2022-08-08");

			Assert::AreEqual(1, e.GetStaffId());
			Assert::AreEqual(std::string("Ying"), e.GetName());
			Assert::AreEqual(std::string("Manager"), e.GetPosition());
			Assert::AreEqual(std::string("123-456-7891"), e.GetPhoneNum());
			Assert::AreEqual(std::string("2022-08-08"), e.GetHireDate());
		}

		TEST_METHOD(TTestCase2_TestingSetters)
		{
			Employee e(2, "Jessie", "KitchenStaff", "198-765-4321", "2023-09-09");

			e.SetName("Dain");
			e.SetPosition("Supervisor");
			e.SetPhoneNum("234-567-8911");
			e.SetHireDate("2022-05-05");

			Assert::AreEqual(std::string("Dain"), e.GetName());
			Assert::AreEqual(std::string("Supervisor"), e.GetPosition());
			Assert::AreEqual(std::string("234-567-8911"), e.GetPhoneNum());
			Assert::AreEqual(std::string("2022-05-05"), e.GetHireDate());
		}

		TEST_METHOD(TestCase3_AddingNewStaffSuccessfully)
		{
			EmployeeInfoManagement m;
			Employee e(9, "Carla", "Manager", "345-678-9123", "2021-02-02");
			m.AddStaff(e);

			Employee* found = m.GetStaff(9);
			Assert::IsNotNull(found);
			Assert::AreEqual(std::string("Carla"), found->GetName());
		}

		TEST_METHOD(TestCase4_StaffIDCannotBeDuplicate)
		{
			EmployeeInfoManagement m;
			Employee e1(9, "Carla", "Manager", "345-678-9123", "2021-02-02");
			Employee e2(9, "Greg", "Cook", "456-789-1234", "2024-02-02");

			m.AddStaff(e1);
			m.AddStaff(e2); 

			Employee* found = m.GetStaff(9);
			Assert::AreEqual(std::string("Carla"), found->GetName());
		}

		TEST_METHOD(TestCase5_UpdatingStaffInfo)
		{
			EmployeeInfoManagement m;
			m.AddStaff(Employee(1, "Eric", "Cook", "567-891-2345", "2022-04-04"));

			Employee* e = m.GetStaff(1);
			Assert::IsNotNull(e);

			e->SetName("Eric");
			e->SetPosition("Senior Cook");
			e->SetPhoneNum("444-444-4444");
			e->SetHireDate("2022-04-08");

			Assert::AreEqual(std::string("Eric"), e->GetName());
			Assert::AreEqual(std::string("Senior Cook"), e->GetPosition());
			Assert::AreEqual(std::string("444-444-4444"), e->GetPhoneNum());
			Assert::AreEqual(std::string("2022-04-08"), e->GetHireDate());
		}

		TEST_METHOD(TestCase6_RemovingStaff)
		{
			EmployeeInfoManagement m;
			m.AddStaff(Employee(2, "Cherry", "Server", "678-912-3456", "2021-07-07"));
			Assert::IsNotNull(m.GetStaff(2));

			m.RemoveStaff(2);
			Assert::IsNull(m.GetStaff(2));
		}

		TEST_METHOD(TestCase7_StaffIDDoesNotExist)
		{
			EmployeeInfoManagement m;
			Employee* e = m.GetStaff(999);
			Assert::IsNull(e);
		}

		TEST_METHOD(TestCase8_Load_FileMissingNoIssue)
		{
			remove("employees.txt");

			EmployeeInfoManagement m;
			m.LoadFromFile();

			Employee* e = m.GetStaff(1);
			Assert::IsNull(e);
		}

		TEST_METHOD(TestCase9_SaveAndLoadDataPersistence)
		{
			remove("employees.txt");

			{
				EmployeeInfoManagement m;
				m.AddStaff(Employee(11, "Grace", "Cook", "546-655-7655", "2022-04-08"));
				m.AddStaff(Employee(12, "Angela", "KitchenStaff", "543-766-8765", "2023-06-09"));
			} 
			//destructor end, file still exist

			//load new
			EmployeeInfoManagement m2;
			m2.LoadFromFile();

			Employee* e1 = m2.GetStaff(11);
			Employee* e2 = m2.GetStaff(12);

			Assert::IsNotNull(e1);
			Assert::IsNotNull(e2);

			Assert::AreEqual(std::string("Grace"), e1->GetName());
			Assert::AreEqual(std::string("Angela"), e2->GetName());
		}
	};
}
