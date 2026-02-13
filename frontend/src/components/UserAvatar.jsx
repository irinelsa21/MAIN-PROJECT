import React from 'react';

const UserAvatar = ({ name, profilePicture, onClick }) => {
    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
    };

    return (
        <button
            onClick={onClick || (() => window.location.href = '/user-profile')}
            className="w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center font-bold text-sm"
            style={{
                animation: 'scaleIn 0.4s ease-out 0.7s both',
                backgroundColor: 'rgba(144, 0, 0, 0.1)',
                color: '#900000',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(144, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(144, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {profilePicture ? (
                <img
                    src={profilePicture.startsWith('http') ? profilePicture : `http://127.0.0.1:8000${profilePicture}`}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                getInitials(name)
            )}
        </button>
    );
};

export default UserAvatar;
