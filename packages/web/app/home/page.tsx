"use client"
import { RawInformation } from "./_schema/informationSchema"
import { useInformations } from "./_hooks/useInformations"
import { AuthorizedPageLayout } from "../(auth)/_components/AuthorizedPageLayout";
import { DataTable } from "mantine-datatable"
import { Alert } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

export default function Home() {

  // お知らせ一覧を取得する
  const { fetchedInformations } = useInformations()

  return (
    <AuthorizedPageLayout title="ホーム">
      {/* お知らせ */}
      <Alert variant="light" color="blue" title="お知らせ" icon={<IconInfoCircle />}>
        <p>サンプルアプリのホーム画面です。<br />
        <a target="_blank" className="text-blue-500" href="https://github.com/shuhei1101/sample-react-app">こちら</a>からGitHubリポジトリを確認できます。<br />
        各機能については左上のメニューボタンよりご確認ください。
        </p>
      </Alert>

      <div className="m-5" />
      {/* お知らせ一覧テーブル */}
      <DataTable<RawInformation> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedInformations}
        columns={[
          { accessor: 'body', title: '内容', resizable: true },
          { accessor: 'created_at', title: '投稿日', resizable: true ,
            render: (record) => {
              const date = new Date(record.created_at);
              const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
              const yyyy = jst.getFullYear();
              const mm = String(jst.getMonth() + 1).padStart(2, '0');
              const dd = String(jst.getDate()).padStart(2, '0');
              return `${yyyy}/${mm}/${dd}`;
            }
          },
        ]}
      />
    </AuthorizedPageLayout>
  );
}
