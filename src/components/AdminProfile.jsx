import React from 'react';
const Profile = () => {
  const admin = {
    name: 'Admin Name',
    email: 'admin@example.com',
    role: 'Web Administrator',
    phone: '+91 9876543210',
    location: 'Chennai, India',
    profileImage: '/images/profile-img.jpg', // Update path as needed
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <img
                src={admin.profileImage}
                alt="Profile"
                className="rounded-circle"
                width="120"
                height="120"
              />
              <h4 className="mt-3">{admin.name}</h4>
              <p className="text-muted mb-0">{admin.role}</p>
            </div>

            <hr />

            <div className="mb-2">
              <strong>Email:</strong>
              <p>{admin.email}</p>
            </div>

            <div className="mb-2">
              <strong>Phone:</strong>
              <p>{admin.phone}</p>
            </div>

            <div className="mb-2">
              <strong>Location:</strong>
              <p>{admin.location}</p>
            </div>

            <div className="text-center">
              <button className="btn btn-outline-primary btn-sm">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
