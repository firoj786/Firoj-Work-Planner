import { useEffect, useState, type FormEvent } from 'react';
import { Button, Group } from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import FormModal from '@/components/common/FormModal';
import { FormModalActions, FormModalForm } from '@/components/common/FormModalActions';
import ScrollPanel from '@/components/common/ScrollPanel';
import { PAGE_PANEL_HEIGHT } from '@/components/common/scrollDefaults';
import { api } from '@/services/api';
import type { KnowledgeArticle } from '@/services/types';
import { ICON_SIZE } from '@/utils/navItems';

export default function KnowledgePage(): React.ReactElement {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  async function loadArticles(): Promise<void> {
    const data = await api.getKnowledge();
    setArticles(data);
    if (selected) {
      setSelected(data.find((a) => a.id === selected.id) ?? null);
    }
  }

  useEffect(() => {
    api.getKnowledge().then(setArticles).catch((err: Error) => setError(err.message));
  }, []);

  function openCreate(): void {
    setEditingArticle(null);
    setTitle('');
    setContent('');
    setCategory('');
    setTags('');
    setShowModal(true);
  }

  function openEdit(article: KnowledgeArticle): void {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content ?? '');
    setCategory(article.category ?? '');
    setTags(article.tags ?? '');
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      if (editingArticle) {
        await api.updateKnowledge(editingArticle.id, { title, content, category, tags });
      } else {
        await api.createKnowledge({ title, content, category, tags });
      }
      setShowModal(false);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleDelete(id: number): Promise<void> {
    if (!window.confirm('Delete this article?')) return;
    await api.deleteKnowledge(id);
    setSelected(null);
    await loadArticles();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Knowledge</h1>
          <p className="text-muted">Internal wiki for docs and how-tos</p>
        </div>
        <Button leftSection={<IconPlus size={ICON_SIZE} stroke={1.75} />} onClick={openCreate}>
          New Article
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="knowledge-layout">
        <div className="knowledge-list">
          <ScrollPanel h={PAGE_PANEL_HEIGHT}>
            {articles.length === 0 ? (
              <div className="empty-state">No articles yet</div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className={`knowledge-item${selected?.id === article.id ? ' active' : ''}`}
                  onClick={() => setSelected(article)}
                >
                  <div className="knowledge-item__title">{article.title}</div>
                  <div className="knowledge-item__meta">
                    {article.category ?? 'General'} · v{article.version}
                  </div>
                </div>
              ))
            )}
          </ScrollPanel>
        </div>

        <div className="knowledge-detail">
          {selected ? (
            <>
              <div className="page-header knowledge-detail__header" style={{ marginBottom: 0 }}>
                <div>
                  <h2>{selected.title}</h2>
                  <p className="text-sm text-muted">Version {selected.version} · {selected.category ?? 'General'}</p>
                </div>
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
                <div className="knowledge-detail__content markdown-preview">{selected.content ?? 'No content'}</div>
              </ScrollPanel>
            </>
          ) : (
            <div className="empty-state">Select an article to read</div>
          )}
        </div>
      </div>

      <FormModal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={editingArticle ? 'Edit Article' : 'New Article'}
      >
        <FormModalForm onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="k-title">Title</label>
            <input id="k-title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="k-content">Content</label>
            <textarea id="k-content" className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="k-category">Category</label>
            <input id="k-category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="k-tags">Tags</label>
            <input id="k-tags" className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <FormModalActions onCancel={() => setShowModal(false)} />
        </FormModalForm>
      </FormModal>
    </div>
  );
}
