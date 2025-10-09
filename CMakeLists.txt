# Set the minimum version of CMake required
cmake_minimum_required(VERSION 3.10)

# Define the name of your project (use the name of your main project directory)
project(Project5_HR CXX)

# --- Clang-Tidy Requirement ---
# This crucial line tells CMake to generate the 'compile_commands.json' file
# which Clang-Tidy needs to understand your code structure.
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Define a variable for the source directory where your .cpp files are
# Adjust 'Project5_HR/Project5_HR' if the path is different relative to this file.
set(SOURCE_DIR "Project5_HR/Project5_HR")

# Find all the source files to include in the build
file(GLOB_RECURSE PROJECT_SOURCES
    "${SOURCE_DIR}/*.cpp"
    "${SOURCE_DIR}/*.cxx"
)

# Define the executable target
# Replace 'MyExecutableName' with what you want your compiled binary to be called.
add_executable(Project5_HR_Executable ${PROJECT_SOURCES})

# --- Add Unit Test Sources ---
# If your unit tests are separate, define a second target for them.
set(TEST_SOURCES "Project5_HR/Project5_HR_Test")

file(GLOB_RECURSE TEST_SOURCES_LIST
    "${TEST_SOURCES}/*.cpp"
)

# Define the test target (adjust dependencies as needed)
add_executable(Project5_HR_Test_Target ${TEST_SOURCES_LIST})
# target_link_libraries(Project5_HR_Test_Target PRIVATE Your_Test_Framework_Link) # Uncomment and adjust if linking is needed

# --- Standard C++ Settings ---
# Force C++17 standard (adjust as necessary)
target_compile_features(Project5_HR_Executable PRIVATE cxx_std_17)
target_compile_features(Project5_HR_Test_Target PRIVATE cxx_std_17)