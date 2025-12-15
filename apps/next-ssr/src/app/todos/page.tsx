import type { Metadata } from 'next';
import Link from 'next/link';
import { getTodos, getUsers } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'Todos - SSR Comparison Suite',
    description: 'Browse todos from JSONPlaceholder API',
    openGraph: {
      title: 'Todos - SSR Comparison Suite',
      description: 'Browse todos from JSONPlaceholder API',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/todos', origin),
    },
  };
}

export default async function TodosPage() {
  const origin = await getRequestOrigin();
  const [todos, users] = await Promise.all([getTodos(), getUsers()]);
  const userMap = new Map(users.map((u) => [u.id, u]));

  const todosByUser = todos.reduce(
    (acc, todo) => {
      if (!acc[todo.userId]) {
        acc[todo.userId] = [];
      }
      acc[todo.userId].push(todo);
      return acc;
    },
    {} as Record<number, typeof todos>
  );

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Todos', href: `${origin}/todos` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="container mx-auto px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Todos</li>
          </ol>
        </nav>

        <h1 className="mb-8 text-4xl font-bold">Todos</h1>
        <p className="mb-8 text-muted-foreground">
          Total: {todos.length} todos
        </p>

        <div className="space-y-8">
          {Object.entries(todosByUser).map(([userId, userTodos]) => {
            const user = userMap.get(Number(userId));
            const completed = userTodos.filter((t) => t.completed).length;
            const total = userTodos.length;

            return (
              <div key={userId} className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {user ? (
                      <Link
                        href={`/users/${userId}`}
                        className="hover:text-primary"
                      >
                        {user.name}
                      </Link>
                    ) : (
                      `User ${userId}`
                    )}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {completed}/{total} completed
                  </span>
                </div>
                <div className="space-y-2">
                  {userTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 rounded-md border bg-muted/50 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        readOnly
                        className="h-5 w-5"
                        aria-label={todo.completed ? 'Completed' : 'Not completed'}
                      />
                      <span
                        className={
                          todo.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }
                      >
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

