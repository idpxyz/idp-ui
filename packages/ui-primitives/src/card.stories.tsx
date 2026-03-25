import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard } from './card';
import { Button } from './button';
import { Activity, TrendingUp, Users } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Card',
};

export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader>
        <CardTitle>Integration Summary</CardTitle>
        <CardDescription>Overview of recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 12, color: '#999' }}>Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="default" size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Stats: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 700 }}>
      <StatCard label="Executions" value="1,284" icon={<Activity size={16} />} trend={{ value: '+12%', positive: true }} />
      <StatCard label="Success Rate" value="99.2%" icon={<TrendingUp size={16} />} description="Last 24 hours" />
      <StatCard label="Active Users" value="42" icon={<Users size={16} />} trend={{ value: '-3%', positive: false }} />
    </div>
  ),
};
