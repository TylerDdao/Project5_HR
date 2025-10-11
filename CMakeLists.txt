# Set the minimum version of CMake required
cmake_minimum_required(VERSION 3.10)

# Define the name of your project
project(Project5_HR CXX)

# --- Clang-Tidy Requirement ---
# This crucial line tells CMake to generate the 'compile_commands.json' file
# which Clang-Tidy needs to understand your code structure.
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# Collect all source files from the new structure
file(GLOB_RECURSE PROJECT_SOURCES
    "${CMAKE_SOURCE_DIR}/src/core/*.cpp"
    "${CMAKE_SOURCE_DIR}/src/communication/*.cpp"
    "${CMAKE_SOURCE_DIR}/src/persistence/*.cpp"
    "${CMAKE_SOURCE_DIR}/src/utils/*.cpp"
    "${CMAKE_SOURCE_DIR}/src/main.cpp"
)

# Define the main executable target
add_executable(Project5_HR_Executable ${PROJECT_SOURCES})

# Set properties
target_compile_features(Project5_HR_Executable PRIVATE cxx_std_17)

# --- Unit Test Target (Optional) ---
# If you have unit tests, uncomment and configure below
set(TEST_DIR "${CMAKE_SOURCE_DIR}/tests")

if(EXISTS ${TEST_DIR})
    file(GLOB_RECURSE TEST_SOURCES
        "${TEST_DIR}/*.cpp"
    )
    
    if(TEST_SOURCES)
        add_executable(Project5_HR_Test_Target ${TEST_SOURCES})
        target_include_directories(Project5_HR_Test_Target PRIVATE ${CMAKE_SOURCE_DIR}/include)
        target_compile_features(Project5_HR_Test_Target PRIVATE cxx_std_17)
        # target_link_libraries(Project5_HR_Test_Target PRIVATE gtest gtest_main) # Uncomment if using Google Test
    endif()
endif()

# Print configuration summary
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Source files found: ${PROJECT_SOURCES}")
