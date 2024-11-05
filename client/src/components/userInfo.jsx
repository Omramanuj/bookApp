import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserInfo = ({ user }) => (
  <Card className="bg-[#FAF7F0] border-[#D8D2C2]">
    <CardHeader>
      <CardTitle className="text-[#4A4947]">Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-[#4A4947]"><span className="font-semibold">Name:</span> {user.name}</p>
        <p className="text-[#4A4947]"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-[#4A4947]"><span className="font-semibold">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </CardContent>
  </Card>
);

export default UserInfo;
