import { useState } from 'react';
import { AutoSkeleton } from 'skeleto';

interface User {
  name: string;
  bio: string;
  avatar: string;
}

const FAKE_USER: User = {
  name: 'Ada Lovelace',
  bio: 'Mathematician and writer. Often regarded as the first computer programmer.',
  avatar: 'https://i.pravatar.cc/128?u=ada',
};

const FEED = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  author: ['Grace Hopper', 'Alan Turing', 'Margaret Hamilton', 'Donald Knuth'][i]!,
  text: 'Just shipped a new feature using Skeleto. The fact that it Just Works on web and native is wild.',
  hasImage: i % 2 === 0,
}));

export function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="demo-page">
      <h1>Skeleto demo</h1>
      <div className="controls">
        <button onClick={() => setLoading((l) => !l)}>
          loading: {String(loading)} (toggle)
        </button>
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          simulate fetch
        </button>
      </div>

      <h2>1. Simple card</h2>
      <AutoSkeleton loading={loading} minDuration={400}>
        <UserCard user={FAKE_USER} />
      </AutoSkeleton>

      <h2 style={{ marginTop: 40 }}>2. Feed</h2>
      <AutoSkeleton loading={loading} staggerChildren={60}>
        <div className="feed">
          {FEED.map((p) => (
            <Post key={p.id} {...p} />
          ))}
        </div>
      </AutoSkeleton>

      <h2 style={{ marginTop: 40 }}>3. Pulse animation</h2>
      <AutoSkeleton loading={loading} animation="pulse">
        <UserCard user={FAKE_USER} />
      </AutoSkeleton>

      <h2 style={{ marginTop: 40 }}>4. List (no measurement)</h2>
      {loading ? (
        <AutoSkeleton.List count={5} estimatedItemHeight={56} gap={10} />
      ) : (
        <div className="feed">
          {FEED.slice(0, 3).map((p) => (
            <Post key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <img className="avatar" src={user.avatar} alt="" />
      <div className="user-card-body">
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
      </div>
    </div>
  );
}

function Post({ author, text, hasImage }: { author: string; text: string; hasImage: boolean }) {
  return (
    <div className="post">
      <div className="post-avatar" />
      <div className="post-body">
        <div className="post-author">{author}</div>
        <div className="post-text">{text}</div>
        {hasImage ? <div className="post-image" /> : null}
      </div>
    </div>
  );
}
