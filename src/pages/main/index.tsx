import Header from '@/components/header';
import TabList from '@/components/tabList';
import FormList from '@/components/formList.tsx';

const mainPage = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center mt-20 w-270 h-246 mx-auto">
        <div className="relative z-10 mb-[-32px]">
          <TabList tabs={['숏폼', '롱폼']} />
        </div>
        <FormList />
      </div>
    </div>
  );
};

export default mainPage;
