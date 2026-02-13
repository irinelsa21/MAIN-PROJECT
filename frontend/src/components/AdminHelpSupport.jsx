import React, { useState, useEffect } from 'react';
import {
  Reply as ReplyIcon, Assignment as AssignmentIcon,
  CheckCircle, Schedule, ThumbUp, ThumbDown, QuestionAnswer, AccessTime, Person, Email, Send,
  HelpOutline
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';


const QueryCard = ({ query, replyText, setReplyText, onSendReply, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusInfo = () => {
    if (query.answer) {
      return {
        label: 'Resolved',
        color: '#4caf50',
        icon: CheckCircle,
      };
    }
    return {
      label: 'Pending',
      color: '#ff9800',
      icon: Schedule,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getReactionDisplay = (reaction) => {
    if (!reaction) return null;

    const r = reaction.toLowerCase();

    // 👍 LIKE TYPES
    if (r === "like" || r === "thumbsup" || r === "👍") {
      return {
        icon: ThumbUp,
        color: "#4caf50",
        bgColor: "rgba(76, 175, 80, 0.15)",
        label: "Helpful",
        emoji: "👍"
      };
    }

    // ❤️ HEART TYPES
    if (r === "heart" || r === "love" || r === "❤️") {
      return {
        icon: ThumbUp,
        color: "#e91e63",
        bgColor: "rgba(233, 30, 99, 0.15)",
        label: "Loved",
        emoji: "❤️"
      };
    }

    // 👎 DISLIKE TYPES
    if (r === "dislike" || r === "👎") {
      return {
        icon: ThumbDown,
        color: "#f44336",
        bgColor: "rgba(244, 67, 54, 0.15)",
        label: "Not Helpful",
        emoji: "👎"
      };
    }

    // DEFAULT — show whatever emoji comes
    return {
      icon: ThumbUp,
      color: "#2196f3",
      bgColor: "rgba(33, 150, 243, 0.15)",
      label: reaction,
      emoji: reaction
    };
  };


  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 overflow-hidden"
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 28px rgba(144, 0, 0, 0.12)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: `fadeInUp 0.5s ease-out ${0.1 + index * 0.05}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'rgba(144, 0, 0, 0.1)',
              animation: 'scaleIn 0.5s ease-out both',
            }}
          >
            <QuestionAnswer style={{ fontSize: 24, color: '#900000' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{query.user_name}</h3>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                style={{
                  backgroundColor: `${statusInfo.color}15`,
                  color: statusInfo.color,
                }}
              >
                <StatusIcon style={{ fontSize: 14 }} />
                <span>{statusInfo.label}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Email style={{ fontSize: 16 }} />
              <span>{query.user_email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: '#900000' }}
          />
          <p className="font-semibold text-gray-700">Question</p>
        </div>
        <p className="text-gray-900 pl-5 leading-relaxed">{query.question}</p>
        <div className="flex items-center space-x-2 mt-2 pl-5 text-xs text-gray-500">
          <AccessTime style={{ fontSize: 14 }} />
          <span>{new Date(query.created_at).toLocaleString()}</span>
        </div>
      </div>

      {/* Answer Section */}
      {query.answer ? (
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            backgroundColor: 'rgba(76, 175, 80, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <ReplyIcon style={{ fontSize: 18, color: '#4caf50' }} />
            <p className="font-semibold text-gray-700">Admin Reply</p>
          </div>
          <p className="text-gray-900 pl-7 leading-relaxed">{query.answer}</p>
          <div className="flex items-center space-x-2 mt-2 pl-7 text-xs text-gray-500">
            <AccessTime style={{ fontSize: 14 }} />
            <span>{new Date(query.replied_at).toLocaleString()}</span>
          </div>

          {/* USER REACTION DISPLAY - Enhanced Version */}
          {query.reaction && (() => {
            const reactionDisplay = getReactionDisplay(query.reaction);
            if (!reactionDisplay) return null;
            const ReactionIcon = reactionDisplay.icon;

            return (
              <div
                className="mt-4 pl-7"
                style={{
                  animation: 'scaleIn 0.5s ease-out',
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="px-4 py-2 rounded-xl flex items-center space-x-2"
                    style={{
                      backgroundColor: reactionDisplay.bgColor,
                      border: `2px solid ${reactionDisplay.color}20`,
                    }}
                  >
                    <ReactionIcon
                      style={{
                        fontSize: 20,
                        color: reactionDisplay.color
                      }}
                    />
                    <span
                      className="font-medium text-sm"
                      style={{ color: reactionDisplay.color }}
                    >
                      User marked as {reactionDisplay.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'rgba(255, 152, 0, 0.05)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
          }}
        >
          <p className="text-sm font-medium text-gray-700 mb-3">Write your reply</p>
          <textarea
            placeholder="Type your detailed reply here..."
            value={replyText[query.id] || ''}
            onChange={(e) =>
              setReplyText({
                ...replyText,
                [query.id]: e.target.value,
              })
            }
            className="w-full rounded-lg p-3 transition-all duration-300 focus:outline-none"
            style={{
              minHeight: '100px',
              border: '2px solid rgba(144, 0, 0, 0.2)',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#900000';
              e.target.style.boxShadow = '0 0 0 3px rgba(144, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(144, 0, 0, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <button
            onClick={() => onSendReply(query.id)}
            disabled={!replyText[query.id]}
            className="mt-3 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300"
            style={{
              backgroundColor: replyText[query.id] ? '#900000' : '#ccc',
              color: 'white',
              cursor: replyText[query.id] ? 'pointer' : 'not-allowed',
              opacity: replyText[query.id] ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (replyText[query.id]) {
                e.currentTarget.style.backgroundColor = '#b00000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(144, 0, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (replyText[query.id]) {
                e.currentTarget.style.backgroundColor = '#900000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Send style={{ fontSize: 18 }} />
            <span>Send Reply</span>
          </button>
        </div>
      )}
    </div>
  );
};

const AdminHelpSupport = () => {
  const [activeItem, setActiveItem] = useState('queries');
  const [adminName] = useState('Irin');
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    liked: 0,
    disliked: 0,
  });

  // FETCH ALL QUERIES
  const fetchQueries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/help/");
      const data = await res.json();
      setQueries(data);

      // Calculate stats including reactions
      const total = data.length;
      const pending = data.filter(q => !q.answer).length;
      const resolved = data.filter(q => q.answer).length;
      const liked = data.filter(q => q.reaction === 'like').length;
      const disliked = data.filter(q => q.reaction === 'dislike').length;
      setStats({ total, pending, resolved, liked, disliked });
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // SEND REPLY
  const sendReply = async (id) => {
    if (!replyText[id]) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/admin/help/reply/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: replyText[id],
        }),
      });

      setReplyText({ ...replyText, [id]: "" });
      fetchQueries();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === 'dashboard') {
      window.location.href = '/admin-dashboard';
    } else if (itemId === 'registration') {
      window.location.href = '/registration-requests';
    } else if (itemId === 'users') {
      window.location.href = '/user-management';
    } else if (itemId === 'announcements') {
      window.location.href = '/admin-announcements';
    } else if (itemId === 'donors') {
      window.location.href = '/admin-donor-management';
    } else if (itemId === 'requests') {
      window.location.href = '/admin-blood-requests';
    } else if (itemId === 'assignments') {
      window.location.href = '/admin-assignments';
    } else if (itemId === 'statistics') {
      window.location.href = '/admin-statistics';
    } else {
      console.log(`Navigated to: ${itemId}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <AdminSidebar activeItem={activeItem} adminName={adminName} />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px' }}>
        {/* Header */}
        {/* Header */}
        <header
          className="sticky top-0 z-40 bg-white"
          style={{
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            animation: 'slideInRight 0.5s ease-out both',
            height: '64px',
          }}
        >
          <div className="px-6 sm:px-8 lg:px-12 h-full">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center space-x-3">
                <HelpOutline style={{ fontSize: 32, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  Help & Support Management
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {/* Stats Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div
              className="bg-white rounded-2xl p-6 transition-all duration-300"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Queries</p>
                  <p className="text-4xl font-bold" style={{ color: '#900000' }}>
                    {stats.total}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(144, 0, 0, 0.1)' }}
                >
                  <QuestionAnswer style={{ fontSize: 28, color: '#900000' }} />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl p-6 transition-all duration-300"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending</p>
                  <p className="text-4xl font-bold" style={{ color: '#ff9800' }}>
                    {stats.pending}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}
                >
                  <Schedule style={{ fontSize: 28, color: '#ff9800' }} />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl p-6 transition-all duration-300"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Resolved</p>
                  <p className="text-4xl font-bold" style={{ color: '#4caf50' }}>
                    {stats.resolved}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}
                >
                  <CheckCircle style={{ fontSize: 28, color: '#4caf50' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Queries List */}
          <div>
            {queries.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-12 text-center"
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <HelpOutline style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Queries Found
                </h3>
                <p className="text-gray-500">
                  All user queries will appear here once submitted.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {queries.map((query, index) => (
                  <QueryCard
                    key={query.id}
                    query={query}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSendReply={sendReply}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHelpSupport;
