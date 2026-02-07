# Custom Hooks Documentation

All custom hooks for the UMich Q&A Platform using Axios, React Hook Form, Yup, and React Hot Toast.

---

## Form Submission Hooks

### `useSubmitQuestion()`

Submit questions or resources for approval.

**Usage:**

```tsx
import { useSubmitQuestion } from "@/hooks";

function MyForm() {
  const { form, onSubmit, isSubmitting } = useSubmitQuestion();

  return (
    <form onSubmit={onSubmit}>
      <input {...form.register("title")} />
      {form.formState.errors.title && (
        <span>{form.formState.errors.title.message}</span>
      )}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

**Returns:**

- `form` - React Hook Form instance
- `onSubmit` - Form submission handler
- `isSubmitting` - Loading state

**Features:**

- Full form validation with Yup
- File upload support
- Toast notifications
- Auto-reset on success

---

## Authentication Hooks

### `useLogin()`

Admin authentication and session management.

**Usage:**

```tsx
import { useLogin } from "@/hooks";

function LoginPage() {
  const { form, onSubmit, isLoading, logout } = useLogin();

  return (
    <form onSubmit={onSubmit}>
      <input type="email" {...form.register("email")} />
      <input type="password" {...form.register("password")} />
      <button type="submit" disabled={isLoading}>
        Login
      </button>
    </form>
  );
}
```

**Returns:**

- `form` - React Hook Form instance
- `onSubmit` - Login handler
- `isLoading` - Loading state
- `logout()` - Logout function

---

## Data Fetching Hooks

### `useDropdowns()`

Fetch all dropdown data for forms.

**Usage:**

```tsx
import { useDropdowns } from "@/hooks";

function MyForm() {
  const { topics, schools, campuses, gradeLevels, universities, isLoading } =
    useDropdowns();

  if (isLoading) return <div>Loading...</div>;

  return (
    <select>
      {topics.map((topic) => (
        <option key={topic.id} value={topic.name}>
          {topic.name}
        </option>
      ))}
    </select>
  );
}
```

**Returns:**

- `topics` - Array of topics
- `schools` - Array of schools
- `campuses` - Array of campuses
- `gradeLevels` - Array of grade levels
- `universities` - Array of universities
- `isLoading` - Loading state
- `error` - Error message
- `refetch()` - Refetch function

---

### `useContent(filters?)`

Fetch approved content with optional filters.

**Usage:**

```tsx
import { useContent } from "@/hooks";

function ContentList() {
  const { content, isLoading, refetch } = useContent({
    university: "UMich",
    type: "Question",
    topic: "Mathematics",
    search: "calculus",
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {content.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

**Parameters:**

- `filters` (optional):
  - `university` - Filter by university
  - `type` - "Question" or "Resource"
  - `topic` - Filter by topic
  - `search` - Search query

**Returns:**

- `content` - Array of approved content
- `isLoading` - Loading state
- `error` - Error message
- `refetch()` - Refetch function

---

## Admin Management Hooks

### `useSubmissions()`

Manage pending submissions (admin only).

**Usage:**

```tsx
import { useSubmissions } from "@/hooks";

function AdminDashboard() {
  const { submissions, isLoading, approveSubmission, rejectSubmission } =
    useSubmissions();

  const handleApprove = async (id: string) => {
    await approveSubmission(id, "UMich");
  };

  return (
    <div>
      {submissions.map((sub) => (
        <div key={sub.id}>
          {sub.title}
          <button onClick={() => handleApprove(sub.id)}>Approve</button>
          <button onClick={() => rejectSubmission(sub.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
```

**Returns:**

- `submissions` - Array of pending submissions
- `isLoading` - Loading state
- `error` - Error message
- `refetch()` - Refetch submissions
- `approveSubmission(id, university)` - Approve function
- `rejectSubmission(id)` - Reject function

---

### `useTopics()`

CRUD operations for topics (admin only).

**Usage:**

```tsx
import { useTopics } from "@/hooks";

function TopicsManager() {
  const { topics, createTopic, updateTopic, deleteTopic } = useTopics();

  const handleCreate = async () => {
    await createTopic({
      name: "New Topic",
      description: "Description",
    });
  };

  return (
    <div>
      {topics.map((topic) => (
        <div key={topic.id}>
          {topic.name}
          <button onClick={() => deleteTopic(topic.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleCreate}>Create New</button>
    </div>
  );
}
```

**Returns:**

- `topics` - Array of topics
- `isLoading` - Loading state
- `error` - Error message
- `refetch()` - Refetch topics
- `createTopic(data)` - Create function
- `updateTopic(id, data)` - Update function
- `deleteTopic(id)` - Delete function

---

### `useAdminStats()`

Fetch dashboard statistics (admin only).

**Usage:**

```tsx
import { useAdminStats } from "@/hooks";

function Dashboard() {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Pending: {stats?.pendingSubmissions}</p>
      <p>Approved: {stats?.approvedContent}</p>
    </div>
  );
}
```

**Returns:**

- `stats` - Statistics object
- `isLoading` - Loading state
- `error` - Error message
- `refetch()` - Refetch stats

---

## Global Features

All hooks include:

- ✅ Automatic error handling
- ✅ Toast notifications (success/error)
- ✅ Loading states
- ✅ TypeScript types
- ✅ Auto authentication (admin hooks)
- ✅ Refetch functionality

---

## Error Handling

All hooks automatically handle errors and show toast notifications. Errors are also available in the `error` state:

```tsx
const { error } = useContent();

if (error) {
  return <div>Error: {error}</div>;
}
```

---

## Authentication

Admin hooks automatically include the authentication token from localStorage. If the token is invalid or expired, the user will be redirected to the login page.
