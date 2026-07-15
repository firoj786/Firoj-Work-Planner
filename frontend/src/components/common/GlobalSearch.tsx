import { useCallback, useEffect, useMemo, useState } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { ROUTES } from '@/utils/constants';

interface SearchOption {
  value: string;
  label: string;
  group: string;
  route: string;
}

/**
 * Loads tasks, notes, and knowledge articles and navigates to the selected result.
 */
export default function GlobalSearch(): React.ReactElement {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadIndex = useCallback(async (): Promise<void> => {
    if (loaded) {
      return;
    }
    setLoading(true);
    try {
      const [tasks, notes, articles] = await Promise.all([
        api.getTasks(),
        api.getNotes(),
        api.getKnowledge(),
      ]);

      const indexed: SearchOption[] = [
        ...tasks.map((task) => ({
          value: `task-${task.id}`,
          label: task.title,
          group: 'Tasks',
          route: ROUTES.PLANNER,
        })),
        ...notes.map((note) => ({
          value: `note-${note.id}`,
          label: note.title,
          group: 'Notes',
          route: ROUTES.NOTES,
        })),
        ...articles.map((article) => ({
          value: `knowledge-${article.id}`,
          label: article.title,
          group: 'Knowledge',
          route: ROUTES.KNOWLEDGE,
        })),
      ];

      setOptions(indexed);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  useEffect(() => {
    if (query.length > 0 && !loaded) {
      void loadIndex();
    }
  }, [query, loaded, loadIndex]);

  const filteredData = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options.slice(0, 8);
    }
    return options.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, 12);
  }, [options, query]);

  return (
    <Autocomplete
      className="global-search"
      placeholder="Search tasks, notes, knowledge..."
      leftSection={loading ? <Loader size={16} /> : <IconSearch size={16} stroke={1.5} />}
      data={filteredData}
      value={query}
      onChange={setQuery}
      onFocus={() => void loadIndex()}
      onOptionSubmit={(value) => {
        const match = options.find((item) => item.value === value);
        if (match) {
          navigate(match.route);
          setQuery('');
        }
      }}
      limit={12}
      comboboxProps={{ withinPortal: true }}
    />
  );
}
