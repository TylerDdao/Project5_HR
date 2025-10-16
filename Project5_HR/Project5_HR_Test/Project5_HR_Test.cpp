//#include "pch.h"
#include "CppUnitTest.h"
#include "../Project5_HR/test.h"
#include "../Project5_HR/employeeinfo.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace Project5HRTest
{
	TEST_CLASS(Project5HRTest)
	{
	public:
		
		/*TEST_METHOD(TestAdd)
		{
			int result = add(5, 7);
			Assert::AreEqual(6, result);
		}*/

		TEST_METHOD(TestCase1_InitializeConstructor)
		{
			Employee e(1, "Ying", "Manager", "123-456-7891", "2022-08-08");

			Assert::AreEqual(1, e.getStaffId());
			Assert::AreEqual(std::string("Ying"), e.getName());
			Assert::AreEqual(std::string("Manager"), e.getPosition());
			Assert::AreEqual(std::string("123-456-7891"), e.getPhoneNum());
			Assert::AreEqual(std::string("2022-08-08"), e.getHireDate());
		}

		TEST_METHOD(TTestCase2_TestingSetters)
		{
			Employee e(2, "Jessie", "KitchenStaff", "198-765-4321", "2023-09-09");

			e.setName("Dain");
			e.setPosition("Supervisor");
			e.setPhoneNum("234-567-8911");
			e.setHireDate("2022-05-05");

			Assert::AreEqual(std::string("Dain"), e.getName());
			Assert::AreEqual(std::string("Supervisor"), e.getPosition());
			Assert::AreEqual(std::string("234-567-8911"), e.getPhoneNum());
			Assert::AreEqual(std::string("2022-05-05"), e.getHireDate());
		}

		TEST_METHOD(TestCase3_AddingNewStaffSuccessfully)
		{
			EmployeeInfoManagement m;
			Employee e(9, "Carla", "Manager", "345-678-9123", "2021-02-02");
			m.addStaff(e);

			Employee* found = m.getStaff(9);
			Assert::IsNotNull(found);
			Assert::AreEqual(std::string("Carla"), found->getName());
		}

		TEST_METHOD(TestCase4_StaffIDCannotBeDuplicate)
		{
			EmployeeInfoManagement m;
			Employee e1(9, "Carla", "Manager", "345-678-9123", "2021-02-02");
			Employee e2(9, "Greg", "Cook", "456-789-1234", "2024-02-02");

			m.addStaff(e1);
			m.addStaff(e2); 

			Employee* found = m.getStaff(9);
			Assert::AreEqual(std::string("Carla"), found->getName());
		}

		TEST_METHOD(TestCase5_UpdatingStaffInfo)
		{
			EmployeeInfoManagement m;
			m.addStaff(Employee(1, "Eric", "Cook", "567-891-2345", "2022-04-04"));

			Employee* e = m.getStaff(1);
			Assert::IsNotNull(e);

			e->setName("Eric");
			e->setPosition("Senior Cook");
			e->setPhoneNum("444-444-4444");
			e->setHireDate("2022-04-08");

			Assert::AreEqual(std::string("Eric"), e->getName());
			Assert::AreEqual(std::string("Senior Cook"), e->getPosition());
			Assert::AreEqual(std::string("444-444-4444"), e->getPhoneNum());
			Assert::AreEqual(std::string("2022-04-08"), e->getHireDate());
		}

		TEST_METHOD(TestCase6_RemovingStaff)
		{
			EmployeeInfoManagement m;
			m.addStaff(Employee(2, "Cherry", "Server", "678-912-3456", "2021-07-07"));
			Assert::IsNotNull(m.getStaff(2));

			m.removeStaff(2);
			Assert::IsNull(m.getStaff(2));
		}

		TEST_METHOD(TestCase7_StaffIDDoesNotExist)
		{
			EmployeeInfoManagement m;
			Employee* e = m.getStaff(999);
			Assert::IsNull(e);
		}

		TEST_METHOD(TestCase8_Load_FileMissingNoIssue)
		{
			remove("employees.txt");

			EmployeeInfoManagement m;
			m.loadFromFile();

			Employee* e = m.getStaff(1);
			Assert::IsNull(e);
		}

		TEST_METHOD(TestCase9_SaveAndLoadDataPersistence)
		{
			remove("employees.txt");

			{
				EmployeeInfoManagement m;
				m.addStaff(Employee(11, "Grace", "Cook", "546-655-7655", "2022-04-08"));
				m.addStaff(Employee(12, "Angela", "KitchenStaff", "543-766-8765", "2023-06-09"));
			} 
			//destructor end, file still exist

			//load new
			EmployeeInfoManagement m2;
			m2.loadFromFile();

			Employee* e1 = m2.getStaff(11);
			Employee* e2 = m2.getStaff(12);

			Assert::IsNotNull(e1);
			Assert::IsNotNull(e2);

			Assert::AreEqual(std::string("Grace"), e1->getName());
			Assert::AreEqual(std::string("Angela"), e2->getName());
		}

		//TEST_METHOD()
		//{

		//}


	};
}
