import { useNavigate } from 'react-router-dom';
import GroupPanel from '@/components/group-panel';

export default function GroupNew() {
  const navigate = useNavigate();

  return (
    <div className="pt-4 md:pt-8">
      <GroupPanel
        onClose={() => navigate(-1)}
      />
    </div>
  );
}