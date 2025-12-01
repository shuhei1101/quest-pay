'use client';
import { AuthorizedPageLayout } from "@/app/(auth)/_components/AuthorizedPageLayout";
import { Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core";
import { FormBackButton } from "@/app/(shared)/_components/FormBackButton";
import { useProjectDelete } from "../_hooks/useProjectDelete";
import { useProjectSave } from "../_hooks/useProjectSave";
import { useProjectUpdate } from "../_hooks/useProjectUpdate";
import { useProject } from "@/app/(project)/_hooks/useProject";
import { useProjectForm } from "../_hooks/useProjectForm";
import { ProjectMemberTable } from "./ProjectMemberTable";
import { UserSelectPopup } from "@/app/(user)/users/_components/UserSelectPopup";
import { useDisclosure } from "@mantine/hooks";
import { UserEntitySchema } from "@/app/(user)/_schema/userSchema";
import { PROJECTS_URL } from "@/app/(core)/appConstants";
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo";

/** プロジェクトフォーム */
export const ProjectForm = ( params: {
  /** プロジェクトID */
  id?: string;
}) => {

  /** ログインユーザ情報を取得する */
  const {isGuest, isAdmin} = useLoginUserInfo()
  
  /** ハンドラ */
  const { handleDelete } = useProjectDelete()
  const { handleSave } = useProjectSave()
  const { handleUpdate } = useProjectUpdate()

  /** 新規登録フラグ */
  const isNew = !params.id || params.id === "";
  /** ID（数値型） */
  const id = params.id ? Number(params.id) : 0;
  
  // プロジェクトとメンバーを取得する
  const { fetchedProject, fetchedMembers, isLoading: projectLoading } = useProject(id)

  // プロジェクトフォームを取得する
  const { register: projectRegister, errors, setValue: setProjectValue, watch: watchProject, isValueChanged, handleSubmit } = useProjectForm({fetchedProject, fetchedMembers});
  /** 全体のロード状態 */
  const loading = projectLoading;

  /** ポップアップの表示状態 */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false);

  /** ユーザ選択時のハンドル */
  const handleMembers = (members: UserEntitySchema[]) => {
    // 現在のメンバーを取得
    const currentMembers = watchProject().members || []
    // 既存メンバーのuser_idリストを作成
    const existingUserIds = currentMembers.map(member => member.user_id)
    // 新規ユーザのみをフィルタリング（既存メンバーに含まれていないもの）
    const newUsers = members.filter(user => !existingUserIds.includes(user.user_id))
    // 既存メンバーと新規ユーザをマージ
    const mergedMembers = [...currentMembers, ...newUsers]
    // メンバーリストを更新
    setProjectValue("members", mergedMembers)
  }

  /** メンバー削除ハンドル */
  const handleMemberRemove = (userId: string) => {
    const currentMembers = watchProject().members || []
    const filteredMembers = currentMembers.filter(member => member.user_id !== userId)
    setProjectValue("members", filteredMembers)
  }

  return (
    <>
      <AuthorizedPageLayout title={isNew ? "プロジェクト作成": "プロジェクト編集"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={PROJECTS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* ゲストの場合は参照のみにする */}
          <fieldset disabled={isGuest} style={{ border: 0, padding: 0 }}>
          {/* プロジェクト入力フォーム */}
          <form onSubmit={handleSubmit((form) => isNew ? handleSave(form) : handleUpdate(form))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* ID入力欄 */}
              <div>
                <Input.Wrapper label="ID" error={errors.id?.message}>
                  <div className="h-6">
                    {/* idがない場合、「-」を表示する */}
                    <p>{ id != 0 ? id : "-" }</p>
                    <input type="hidden" value={id} {...projectRegister("id", { valueAsNumber: true })} />
                  </div>
                </Input.Wrapper>
              </div>
              {/* プロジェクト名入力欄 */}
              <div>
                <Input.Wrapper label="プロジェクト名" required error={errors.name?.message}>
                  <Input className="max-w-120" {...projectRegister("name")} />
                </Input.Wrapper>
              </div>
              {/* プロジェクト詳細入力欄 */}
              <div>
                  <Input.Wrapper label="プロジェクト詳細" error={errors.detail?.message}>
                    <Textarea className="max-w-120" placeholder="200文字以内で入力してください。"
                    autosize minRows={4} maxRows={4} {...projectRegister("detail")} />
                  </Input.Wrapper>
              </div>
              {/* プロジェクトメンバーテーブル */}
              <Input.Wrapper label="プロジェクトメンバー" error={errors.members?.message} required>
                <ProjectMemberTable members={watchProject().members} onAddClick={()=>openPopup()} onDeleteClick={handleMemberRemove} />
              </Input.Wrapper>
              {/* 公開フラグ入力欄 */}
              <div>
                <Input.Wrapper label="公開／非公開">
                  <Checkbox
                    {...projectRegister("is_public")}
                  />
                </Input.Wrapper>
              </div>
            </div>
            <Space h="md" />
            {/* サブミットボタン */}
            <Group>
              {isGuest ?
              <></>
              :
              <>
                {isNew ? 
                  <Button hidden={isGuest} type="submit" loading={loading} >保存</Button>
                :
                <>
                  <Button hidden={isGuest} loading={loading} color="red.7" onClick={() => handleDelete({
                    id: fetchedProject!.id,
                    name: fetchedProject!.name,
                    detail: fetchedProject!.detail,
                    is_public: fetchedProject!.is_public,
                    created_at: fetchedProject!.created_at,
                    updated_at: fetchedProject!.updated_at,
                    members: fetchedMembers
                  })} >削除</Button>
                  <Button hidden={isGuest} type="submit" loading={loading} disabled={!isValueChanged} >更新</Button>
                </>
                }
              </>
            }
            </Group>
          </form>
          </fieldset>
        </Box>
        </div>
        <UserSelectPopup close={closePopup} handleUsers={handleMembers} opened={popupOpened} />
      </AuthorizedPageLayout>
    </>
  )
}
