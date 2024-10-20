import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ userData }) => (
  <div className="mb-5">
    <h2 className="text-xl mb-2">User Information:</h2>
    <pre className="bg-gray-100 p-3 rounded overflow-auto">
      {JSON.stringify(userData, null, 2)}
    </pre>
  </div>
);

export default UserInfo;