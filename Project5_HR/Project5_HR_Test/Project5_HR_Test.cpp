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
<<<<<<< Updated upstream
			int result = add(5, 7);
=======
			int result = minus(77, 1);
>>>>>>> Stashed changes
			Assert::AreEqual(6, result);
		}
	};
}
