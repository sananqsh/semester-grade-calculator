import React, { useState } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';

export default function SemesterGradeCalculator() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseWeight, setNewCourseWeight] = useState(1);

  const addCourse = () => {
    if (newCourseName.trim()) {
      const newCourse = {
        id: Date.now(),
        name: newCourseName.trim(),
        weight: newCourseWeight,
        grade: 10
      };
      setCourses([...courses, newCourse]);
      setNewCourseName('');
      setNewCourseWeight(1);
    }
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateGrade = (id, newGrade) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, grade: parseFloat(newGrade) } : course
    ));
  };

  const calculateFinalGrade = () => {
    if (courses.length === 0) return 0;

    const totalWeightedGrades = courses.reduce((sum, course) =>
      sum + (course.grade * course.weight), 0
    );
    const totalWeights = courses.reduce((sum, course) => sum + course.weight, 0);

    return totalWeights > 0 ? (totalWeightedGrades / totalWeights) : 0;
  };

  const getGradeColor = (grade) => {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  const finalGrade = calculateFinalGrade();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Semester Grade Calculator</h1>
            </div>
            <p className="text-gray-600">Add your courses and track your weighted semester grade</p>
          </div>

          {/* Add Course Form */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Course</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, History"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (Units)</label>
                <select
                  value={newCourseWeight}
                  onChange={(e) => setNewCourseWeight(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>1 Unit</option>
                  <option value={2}>2 Units</option>
                  <option value={3} selected>3 Units</option>
                  <option value={4}>4 Units</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={addCourse}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </button>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Courses</h2>

            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No courses added yet</p>
                <p>Add your first course above to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.weight} unit{course.weight !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
                          {course.grade.toFixed(1)}
                        </div>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Grade: 0</span>
                        <span>20</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={course.grade}
                        onChange={(e) => updateGrade(course.id, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Grade Display */}
          {courses.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl font-semibold mb-2">Semester Final Grade</h2>
              <div className="text-5xl font-bold mb-2">
                {finalGrade.toFixed(2)}
              </div>
              <p className="text-indigo-100">
                Weighted average across {courses.length} course{courses.length !== 1 ? 's' : ''}
              </p>
              <div className="mt-4 text-sm text-indigo-200">
                Total Units: {courses.reduce((sum, course) => sum + course.weight, 0)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
