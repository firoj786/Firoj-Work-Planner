import { useEffect, useState, type FormEvent } from 'react';
import { Button, Group } from '@mantine/core';
import { IconPencil, IconPin, IconPlus, IconTrash } from '@tabler/icons-react';
import FormModal from '@/components/common/FormModal';
import { FormModalActions, FormModalForm } from '@/components/common/FormModalActions';
import ScrollPanel from '@/components/common/ScrollPanel';
import { PAGE_PANEL_HEIGHT } from '@/components/common/scrollDefaults';
import { api } from '@/services/api';
import type { Note } from '@/services/types';
import { ICON_SIZE } from '@/utils/navItems';

export default function NotesPage(): React.ReactElement {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  async function loadNotes(): Promise<void> {
    const data = await api.getNotes();
    setNotes(data);
    if (selected) {
      setSelected(data.find((n) => n.id === selected.id) ?? null);
    }
  }

  useEffect(() => {
    api.getNotes().then(setNotes).catch((err: Error) => setError(err.message));
  }, []);

  function openCreate(): void {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setTags('');
    setCategory('');
    setShowModal(true);
  }

  function openEdit(note: Note): void {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content ?? '');
    setTags(note.tags ?? '');
    setCategory(note.category ?? '');
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      if (editingNote) {
        await api.updateNote(editingNote.id, {
          title,
          content,
          tags,
          category,
          pinned: editingNote.pinned,
          favorite: editingNote.favorite,
          archived: false,
        });
      } else {
        await api.createNote({ title, content, tags, category });
      }
      setShowModal(false);
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleDelete(id: number): Promise<void> {
    if (!window.confirm('Delete this note?')) return;
    await api.deleteNote(id);
    setSelected(null);
    await loadNotes();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p className="text-muted">Markdown-friendly notes with tags</p>
        </div>
        <Button leftSection={<IconPlus size={ICON_SIZE} stroke={1.75} />} onClick={openCreate}>
          New Note
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="page-grid page-grid--two">
        <ScrollPanel className="notes-grid-scroll" h={PAGE_PANEL_HEIGHT}>
          <div className="notes-grid">
            {notes.length === 0 ? (
              <div className="empty-state card">No notes yet</div>
            ) : (
              notes.map((note) => (
                <article key={note.id} className="note-card" onClick={() => setSelected(note)}>
                  <div className="note-card__title">
                    <Group gap={6} wrap="nowrap">
                      {note.pinned && (
                        <IconPin size={16} stroke={1.75} className="note-card__pin" aria-label="Pinned" />
                      )}
                      <span>{note.title}</span>
                    </Group>
                  </div>
                  <div className="note-card__preview">{note.content ?? 'Empty note'}</div>
                  {note.tags && (
                    <div className="note-card__tags">
                      {note.tags.split(',').map((tag) => (
                        <span key={tag.trim()} className="badge badge--todo">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </ScrollPanel>

        <div className="note-editor">
          {selected ? (
            <>
              <div className="page-header note-editor__header" style={{ marginBottom: 0, padding: '1.25rem 1.25rem 0' }}>
                <h2>{selected.title}</h2>
                <Group gap="sm">
                  <Button
                    size="compact-sm"
                    variant="default"
                    leftSection={<IconPencil size={14} stroke={1.75} />}
                    onClick={() => openEdit(selected)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="compact-sm"
                    variant="light"
                    color="red"
                    leftSection={<IconTrash size={14} stroke={1.75} />}
                    onClick={() => void handleDelete(selected.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </div>
              <ScrollPanel h={PAGE_PANEL_HEIGHT}>
                <div className="note-editor__content markdown-preview">{selected.content ?? 'No content'}</div>
              </ScrollPanel>
            </>
          ) : (
            <div className="empty-state">Select a note to preview</div>
          )}
        </div>
      </div>

      <FormModal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={editingNote ? 'Edit Note' : 'New Note'}
      >
        <FormModalForm onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="note-title">Title</label>
            <input id="note-title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-content">Content (Markdown)</label>
            <textarea id="note-content" className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-tags">Tags (comma-separated)</label>
            <input id="note-tags" className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-category">Category</label>
            <input id="note-category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <FormModalActions onCancel={() => setShowModal(false)} />
        </FormModalForm>
      </FormModal>
    </div>
  );
}
