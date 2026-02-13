import React, { useState, useEffect } from 'react';
import {
  Bloodtype,
  LocalHospital,
  CheckCircle,
  Campaign,
  History,
  Help,
  Person,
  Send,
  Delete,
  ThumbUp,
  ThumbDown,
  QuestionAnswer,
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';


export default function UserHelpSupport() {
  const [question, setQuestion] = useState("");
  const [queries, setQueries] = useState([]);
  const [activeItem, setActiveItem] = useState('help');
  const [userName, setUserName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      window.location.href = '/login';
      return;
    }

    // Mark as seen
    localStorage.setItem(`last_seen_help_${user_id}`, new Date().toISOString());

    fetch(`http://127.0.0.1:8000/api/user-profile/${user_id}/`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name);
        setBloodGroup(data.blood_group);
        setProfilePicture(data.profile_picture);
      })
      .catch(err => console.error(err));

    fetchMyQueries();
  }, []);

  const fetchMyQueries = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/help/my/?user_id=${user_id}`
    );
    const data = await res.json();
    setQueries(data);
  };

  const submitQuery = async () => {
    if (!question.trim()) return;

    await fetch("http://127.0.0.1:8000/api/help/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, question }),
    });

    setQuestion("");
    fetchMyQueries();
  };

  const deleteQuery = async (id) => {
    if (!window.confirm("Delete this query?")) return;
    await fetch(`http://127.0.0.1:8000/api/help/delete/${id}/`, { method: "DELETE" });
    fetchMyQueries();
  };

  const react = async (query_id, emoji) => {
    await fetch("http://127.0.0.1:8000/api/help/react/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query_id, reaction: emoji }),
    });
    fetchMyQueries();
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <UserSidebar activeItem={activeItem} userName={userName} bloodGroup={bloodGroup} profilePicture={profilePicture} />

      <div style={{ marginLeft: '280px' }}>
        <header
          className="sticky top-0 z-40 transition-all duration-300"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            animation: 'slideInRight 0.5s ease-out 0.2s both',
            height: '64px',
          }}
        >
          <div className="px-8 h-full flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
              Help & Support
            </h1>
            <UserAvatar name={userName} profilePicture={profilePicture} />
          </div>
        </header>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>

        <main
          className="max-w-5xl mx-auto px-8 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {/* Ask Question Section */}
          <div
            className="bg-white rounded-2xl p-8 mb-8"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.5s ease-out',
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(144, 0, 0, 0.1)' }}
              >
                <QuestionAnswer style={{ fontSize: 24, color: '#900000' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                Ask a Question
              </h2>
            </div>

            <textarea
              placeholder="Describe your question or concern in detail..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-900 outline-none transition-all duration-300"
              style={{
                minHeight: '120px',
                fontSize: '15px',
                resize: 'vertical',
              }}
            />

            <button
              onClick={submitQuery}
              disabled={!question.trim()}
              className="mt-4 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center space-x-2"
              style={{
                backgroundColor: question.trim() ? '#900000' : '#ccc',
                cursor: question.trim() ? 'pointer' : 'not-allowed',
                boxShadow: question.trim() ? '0 4px 12px rgba(144, 0, 0, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (question.trim()) {
                  e.currentTarget.style.backgroundColor = '#700000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(144, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (question.trim()) {
                  e.currentTarget.style.backgroundColor = '#900000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(144, 0, 0, 0.3)';
                }
              }}
            >
              <Send style={{ fontSize: 20 }} />
              <span>Submit Query</span>
            </button>
          </div>

          {/* My Queries Section */}
          <div style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
              My Queries ({queries.length})
            </h2>

            {queries.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-12 text-center"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <QuestionAnswer style={{ fontSize: 64, color: '#ddd', marginBottom: '16px' }} />
                <p className="text-gray-500 text-lg">No queries yet. Ask your first question above!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {queries.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-6 transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      animation: `fadeInUp 0.5s ease-out ${0.3 + idx * 0.1}s both`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(q.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-lg text-gray-900 leading-relaxed">
                          <strong>Q:</strong> {q.question}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteQuery(q.id)}
                        className="ml-4 p-2 rounded-lg transition-all duration-300"
                        style={{ color: '#d32f2f' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Delete query"
                      >
                        <Delete style={{ fontSize: 20 }} />
                      </button>
                    </div>

                    {q.answer && (
                      <div
                        className="mt-4 p-5 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(144, 0, 0, 0.05) 0%, rgba(144, 0, 0, 0.02) 100%)',
                          borderLeft: '4px solid #900000',
                        }}
                      >
                        <p className="text-sm font-semibold mb-2" style={{ color: '#900000' }}>
                          Admin Reply:
                        </p>
                        <p
                          className="text-gray-700 leading-relaxed"
                          style={{ fontStyle: 'italic' }}
                        >
                          {q.answer}
                        </p>

                        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Was this helpful?</span>
                          <button
                            onClick={() => react(q.id, "👍")}
                            className="px-3 py-1.5 rounded-lg transition-all duration-300"
                            style={{
                              backgroundColor: q.reaction === "👍" ? 'rgba(76, 175, 80, 0.15)' : '#f5f5f5',
                              border: q.reaction === "👍" ? '2px solid #4caf50' : '2px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (q.reaction !== "👍") e.currentTarget.style.backgroundColor = '#e0e0e0';
                            }}
                            onMouseLeave={(e) => {
                              if (q.reaction !== "👍") e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }}
                          >
                            👍
                          </button>
                          <button
                            onClick={() => react(q.id, "👎")}
                            className="px-3 py-1.5 rounded-lg transition-all duration-300"
                            style={{
                              backgroundColor: q.reaction === "👎" ? 'rgba(244, 67, 54, 0.15)' : '#f5f5f5',
                              border: q.reaction === "👎" ? '2px solid #f44336' : '2px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (q.reaction !== "👎") e.currentTarget.style.backgroundColor = '#e0e0e0';
                            }}
                            onMouseLeave={(e) => {
                              if (q.reaction !== "👎") e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }}
                          >
                            👎
                          </button>
                          {q.reaction && (
                            <span className="text-sm font-medium" style={{ color: '#900000' }}>
                              You reacted with {q.reaction}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {!q.answer && (
                      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: '#ffa726',
                            animation: 'pulse 2s ease-in-out infinite',
                          }}
                        />
                        <span>Awaiting admin response...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}