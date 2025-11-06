# Set the minimum version of CMake required
cmake_minimum_required(VERSION 3.15)

# Define the name of your project
project(Project5_HR CXX)

# --- Clang-Tidy Requirement ---
# Generate compile_commands.json (needed for clang-tidy)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# --- Collect all source files from your project folder ---
file(GLOB_RECURSE PROJECT_SOURCES
    "${CMAKE_SOURCE_DIR}/Project5_HR/Project5_HR/*.cpp"
)

# Define the main executable target
add_executable(Project5_HR_Executable ${PROJECT_SOURCES})

# Set compile features explicitly
target_compile_features(Project5_HR_Executable PRIVATE cxx_std_20)

# --- Unit Test Target (Optional) ---
set(TEST_DIR "${CMAKE_SOURCE_DIR}/Project5_HR/Project5_HR_Test")

if(EXISTS ${TEST_DIR})
    file(GLOB_RECURSE TEST_SOURCES
        "${TEST_DIR}/*.cpp"
    )
    
    if(TEST_SOURCES)
        add_executable(Project5_HR_Test_Target ${TEST_SOURCES})
        target_include_directories(Project5_HR_Test_Target PRIVATE ${CMAKE_SOURCE_DIR}/include)
        target_compile_features(Project5_HR_Test_Target PRIVATE cxx_std_20)
        # target_link_libraries(Project5_HR_Test_Target PRIVATE gtest gtest_main) # Uncomment if using Google Test
    endif()
endif()

# --- Summary ---
message(STATUS "------------------------------------------")
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Source files found: ${PROJECT_SOURCES}")
message(STATUS "------------------------------------------")
