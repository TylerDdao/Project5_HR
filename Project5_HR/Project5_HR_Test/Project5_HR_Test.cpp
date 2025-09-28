//#include "pch.h"
#include "CppUnitTest.h"
#include "../Project5_HR/test.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace Project5HRTest
{
	TEST_CLASS(Project5HRTest)
	{
	public:
		
		TEST_METHOD(TestAdd)
		{
			int result = add(1, 7);
			Assert::AreEqual(8, result);
		}
	};
}
