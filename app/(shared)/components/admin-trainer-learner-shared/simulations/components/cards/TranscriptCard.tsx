'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Collapsible,
  CollapsibleContent
} from '@/app/(shared)/components/ui/collapsible'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import {
  ScrollArea,
  ScrollBar,
  ScrollThumb
} from '@/app/(shared)/components/ui/scroll-area'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'
import { roles } from '@/app/(shared)/services/userService'
import { TranscriptComment, TranscriptType } from '@/app/(shared)/types'
import { cn, hasStringData } from '@/app/(shared)/utils'
import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MessageCircle,
  MessageCircleMore,
  Sparkle,
  X
} from 'lucide-react'
import { ComponentProps, Fragment, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useGetSimulationResults, {
  loadTranscriptService
} from '../../hooks/useGetSimulationResults'
import {
  useOpenTranscriptCommentsStore,
  useTranscriptCommentStore,
  useTranscriptWithUpdatedCommentsStore
} from '../../hooks/useTranscriptCommentStore'

function CommentCard(props: {
  transcript: TranscriptType
  comment: TranscriptComment
  className?: string
}) {
  const { transcript, comment, className } = props

  return (
    <article
      className={cn(
        'grid gap-2 px-3 py-2',
        comment.from_type !== 'ai' &&
          'bg-white border border-t-0 border-neutral-gray-200',
        comment.from_type === 'ai' &&
          'bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end text-white',
        className
      )}
    >
      <h4 className='flex justify-between gap-2'>
        <span className='flex items-center gap-2'>
          {comment.from_type !== 'ai' && (
            <MessageCircle
              fill='currentColor'
              className='size-3 text-purple-shade-darkest2'
            />
          )}
          {comment.from_type === 'ai' && (
            <Sparkle fill='currentColor' className='size-3' />
          )}

          <span className='font-medium text-xs tracking-[0.03rem] uppercase'>
            {comment.from?.full_name}
          </span>
        </span>

        <DeleteCommentDialog
          key={comment._id}
          transcript={transcript}
          comment={comment}
          isVisible
        />
      </h4>

      <p className='text-sm'>{comment.text}</p>
    </article>
  )
}

function CommentsCollapsibleButton(props: {
  transcript: TranscriptType
  className?: string
}) {
  const openTranscriptCommentsStore = useOpenTranscriptCommentsStore()
  const { transcript, className } = props
  const { comments } = transcript

  function openComments() {
    openTranscriptCommentsStore.setId(transcript._id)
  }

  const firstComment = comments[0]
  const otherCommenterCt = comments.length - 1

  let summaryText = firstComment?.from?.full_name ?? ''
  if (otherCommenterCt > 0) {
    summaryText = `${firstComment?.from?.full_name} +${otherCommenterCt} other`
  }
  if (otherCommenterCt > 1) {
    summaryText = `${firstComment?.from?.full_name} +${otherCommenterCt} others`
  }

  const hasComments = comments.length > 0

  return (
    <button
      onClick={openComments}
      className={cn(
        'w-full',
        'flex justify-between gap-2 px-3 py-2',
        firstComment?.from_type !== 'ai' &&
          'bg-white border border-t-0 border-neutral-gray-200',
        firstComment?.from_type === 'ai' &&
          'bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end text-white',
        className
      )}
    >
      {hasComments ? (
        <span className='flex items-center gap-2'>
          {firstComment?.from_type !== 'ai' && (
            <MessageCircle
              fill='currentColor'
              className='size-3 text-purple-shade-darkest2'
            />
          )}
          {firstComment?.from_type === 'ai' && (
            <Sparkle fill='currentColor' className='size-3' />
          )}

          <span className='font-medium text-xs tracking-[0.03rem] uppercase'>
            {summaryText}
          </span>
        </span>
      ) : (
        <p className='text-xs text-neutral-gray-400'>No comments</p>
      )}

      <span
        className={cn(
          firstComment?.from_type === 'ai' &&
            'text-white hover:text-white hover:bg-accent/50'
        )}
      >
        <ChevronDown className='size-4 transition' />
      </span>
    </button>
  )
}

function CommentsCollapsible(props: { transcript: TranscriptType }) {
  const { transcript } = props
  const { comments } = transcript
  const openTranscriptCommentsStore = useOpenTranscriptCommentsStore()

  if (transcript.from_type !== 'user') return null

  return (
    <Collapsible
      open={openTranscriptCommentsStore.id === transcript._id}
      className='w-full overflow-hidden group'
    >
      <CommentsCollapsibleButton
        transcript={transcript}
        className='rounded-b-[4px] group-data-[state=open]:hidden'
      />

      <CollapsibleContent>
        <ol>
          {comments.map((comment, idx) => (
            <li key={idx}>
              <CommentCard transcript={transcript} comment={comment} />
            </li>
          ))}

          <li
            className={cn(
              'grid gap-2 px-3 py-2',
              'bg-white border border-t-0 border-neutral-gray-200',
              'rounded-b-[4px]'
            )}
          >
            <CommentForm transcript={transcript} />
          </li>
        </ol>
      </CollapsibleContent>
    </Collapsible>
  )
}

function DeleteCommentDialog(props: {
  transcript: TranscriptType
  comment: TranscriptComment
  onDelete?: () => void
  isVisible?: boolean
}) {
  const { transcript, comment, onDelete, isVisible = false } = props
  const { user } = useUser()
  const { orgSlug, membership } = useOrganization()
  const { transcriptsMutate } = useGetSimulationResults()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function deleteComment() {
    setIsSubmitting(true)
    try {
      const role = membership?.roles[0]
      const transcriptService = await loadTranscriptService(role || '')
      await transcriptService.deleteComment(
        transcript._id,
        comment._id,
        orgSlug
      )
      await transcriptsMutate()

      onDelete?.()
      toast.warning('Comment deleted!')
    } catch (error) {
      console.warn(error)
      toast.error('Failed deleting comment.')
    }
    setIsSubmitting(false)
  }

  const isCommentOfUser = user?._id === comment.from?._id

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={!isCommentOfUser || !isVisible}
          className={cn(
            'disabled:opacity-25 disabled:bg-inherit disabled:hover:bg-inherit disabled:text-inherit size-fit',
            !isCommentOfUser && 'disabled:opacity-0'
          )}
        >
          <X className='size-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='scale-90 rounded-lg lg:scale-100'>
        <DialogHeader className='text-left'>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 lg:gap-0'>
          <DialogClose asChild>
            <Button variant='outline' size='lg'>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant='destructive'
            size='lg'
            disabled={isSubmitting}
            onClick={deleteComment}
          >
            {isSubmitting ? <span>Deleting...</span> : <span>Yes, delete</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CommentSliderSection(props: {
  transcript: TranscriptType
  comment: TranscriptComment
  onDelete?: () => void
  isVisible?: boolean
}) {
  const { comment } = props
  return (
    <section className='grid gap-2'>
      <h4 className='flex items-center justify-between gap-2'>
        <span className='flex items-center gap-2'>
          {comment.from_type !== 'ai' && (
            <MessageCircle
              fill='currentColor'
              className='size-3 text-purple-shade-darkest2'
            />
          )}
          {comment.from_type === 'ai' && (
            <Sparkle fill='currentColor' className='size-3' />
          )}

          <span className='font-medium text-xs tracking-[0.03rem] uppercase'>
            {comment.from?.full_name}
          </span>
        </span>

        <DeleteCommentDialog key={comment._id} {...props} />
      </h4>

      <p className='text-sm'>{comment.text}</p>
    </section>
  )
}

function CommentsSlider(props: { transcript: TranscriptType }) {
  const { transcript } = props
  const { comments } = transcript

  const { mode } = useTranscriptCommentStore()
  const transcriptWithUpdatedCommentsStore =
    useTranscriptWithUpdatedCommentsStore()

  let defaultIdx = 0
  if (transcriptWithUpdatedCommentsStore.id === transcript._id) {
    defaultIdx = comments.length - 1
  }
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx)
  useEffect(() => {
    transcriptWithUpdatedCommentsStore.setId(null)
  }, [])

  function adjustSelectedIdxAfterDelete(deletedIdx: number) {
    if (deletedIdx === comments.length - 1) {
      setSelectedIdx(comments.length - 2)
    }
  }

  const hasPrevComment = 0 < selectedIdx
  function prevComment() {
    if (!hasPrevComment) return
    setSelectedIdx(selectedIdx - 1)
  }

  const hasNextComment = selectedIdx < comments.length - 1
  function nextComment() {
    if (!hasNextComment) return
    setSelectedIdx(selectedIdx + 1)
  }

  const hasComments = comments.length > 0
  const hasMultipleComments = comments.length > 1

  if (!hasComments) return null

  const selectedComment = comments[selectedIdx]

  return (
    <fieldset
      disabled={mode === 'selecting'}
      className={cn(
        'transition disabled:opacity-40',
        'grid gap-4 p-3 rounded-[4px] border border-transparent',
        hasMultipleComments && 'pb-2',
        selectedComment?.from_type !== 'ai' &&
          'bg-white border-neutral-gray-400',
        selectedComment?.from_type === 'ai' &&
          'bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end text-white'
      )}
    >
      <div className='grid *:row-[1] *:col-[1] overflow-hidden'>
        {comments.map((comment, idx) => (
          <div
            key={comment._id}
            className={cn(
              'transition duration-500',
              selectedIdx < idx && 'translate-x-full opacity-0',
              idx < selectedIdx && '-translate-x-full opacity-0'
            )}
          >
            <CommentSliderSection
              transcript={transcript}
              comment={comment}
              onDelete={() => adjustSelectedIdxAfterDelete(idx)}
              isVisible={selectedIdx === idx}
            />
          </div>
        ))}
      </div>

      {hasMultipleComments && (
        <footer className='flex justify-between items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            disabled={!hasPrevComment}
            onClick={prevComment}
            className='p-1 disabled:opacity-25 disabled:bg-inherit disabled:hover:bg-inherit disabled:text-inherit size-fit'
          >
            <ChevronLeft className='size-5' />
          </Button>

          <p className='text-xs'>
            {selectedIdx + 1} of {comments.length}
          </p>

          <Button
            variant='ghost'
            size='icon'
            disabled={!hasNextComment}
            onClick={nextComment}
            className='p-1 disabled:opacity-25 disabled:bg-inherit disabled:hover:bg-inherit disabled:text-inherit size-fit'
          >
            <ChevronRight className='size-5' />
          </Button>
        </footer>
      )}
    </fieldset>
  )
}

function CommentForm(props: { transcript: TranscriptType }) {
  const { transcript } = props
  const { orgSlug, membership } = useOrganization()
  const transcriptCommentStore = useTranscriptCommentStore()
  const { selectedTranscriptId, commentText } = transcriptCommentStore
  const { setSelectedTranscriptId, setCommentText, reset } =
    transcriptCommentStore
  const transcriptWithUpdatedCommentsStore =
    useTranscriptWithUpdatedCommentsStore()
  const { transcriptsMutate } = useGetSimulationResults()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function ensureTranscriptIsSelected() {
    setSelectedTranscriptId(transcript._id)
  }

  const submit: ComponentProps<'form'>['onSubmit'] = async (event) => {
    event.preventDefault()

    if (selectedTranscriptId === null) {
      console.warn('No transcript selected...?')
      return
    }

    setIsSubmitting(true)
    try {
      const role = membership?.roles[0]
      const transcriptService = await loadTranscriptService(role || '')
      await transcriptService.createComment(
        selectedTranscriptId,
        orgSlug,
        commentText
      )
      await transcriptsMutate()
      reset()
      transcriptWithUpdatedCommentsStore.setId(selectedTranscriptId)
    } catch (error) {
      console.warn(error)
      toast.error('Failed adding comment.')
    }
    setIsSubmitting(false)
  }

  const canSubmit = hasStringData(commentText)

  return (
    <form onSubmit={submit}>
      <fieldset
        disabled={isSubmitting}
        className='rounded-[4px] bg-white lg:border lg:border-neutral-gray-800 flex items-center gap-3 lg:p-3'
      >
        <input
          type='text'
          autoFocus
          onFocus={ensureTranscriptIsSelected}
          placeholder='Add comment...'
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          className='w-full p-0 text-sm placeholder:text-sm placeholder:text-neutral-gray-400 disabled:opacity-50'
          /** `@tailwindcss/forms` seems to override these properties */
          style={{ borderColor: 'transparent', boxShadow: 'none' }}
        />

        <Button
          size='icon'
          disabled={!canSubmit}
          className='rounded-full p-1 lg:p-1.5 disabled:opacity-25 disabled:bg-inherit disabled:hover:bg-inherit disabled:text-inherit size-fit'
        >
          {isSubmitting ? (
            <LoaderCircle className='size-4 lg:size-5 animate-spin' />
          ) : (
            <ArrowUp className='size-4 lg:size-5' />
          )}
        </Button>
      </fieldset>
    </form>
  )
}

function DesktopCommentsListItem(props: {
  transcripts: TranscriptType[]
  idx: number
}) {
  const { transcripts, idx } = props
  const { mode, selectedTranscriptId } = useTranscriptCommentStore()

  const transcript = transcripts[idx]
  if (transcript === undefined) {
    console.warn('Transcript to render comments for does not exist...?')
    return null
  }

  /** Calculate row span based on next transcripts */
  let nextUserIdx = idx + 1
  for (; nextUserIdx < transcripts.length; nextUserIdx++) {
    const nextTranscript = transcripts[nextUserIdx]
    if (nextTranscript.from_type === 'user') break
  }
  const spanCt = nextUserIdx - idx

  /** Based on Tailwind `row-span-X` */
  const gridRow = `span ${spanCt} / span ${spanCt}`

  /** Edge case for when the first transcript(s) does not come from the user */
  if (transcript.from_type !== 'user' && idx === 0) {
    return (
      <li className='mb-4 lg:mb-5 hidden lg:block' style={{ gridRow }}></li>
    )
  }

  if (transcript.from_type !== 'user') {
    return null
  }

  const isTranscriptSelected = selectedTranscriptId === transcript._id

  return (
    <li className='mb-4 lg:mb-5 hidden lg:block' style={{ gridRow }}>
      {mode === 'selecting' && isTranscriptSelected ? (
        <CommentForm transcript={transcript} />
      ) : (
        <CommentsSlider transcript={transcript} />
      )}
    </li>
  )
}

function TranscriptDisplay(props: { transcript: TranscriptType }) {
  const { mode, selectedTranscriptId, setSelectedTranscriptId } =
    useTranscriptCommentStore()
  const { transcript } = props
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { dialogue_value, from_type, comments } = transcript

  function selectTranscript() {
    setSelectedTranscriptId(transcript._id)
  }

  const hasComments = comments.length > 0
  const isTranscriptSelected = selectedTranscriptId === transcript._id

  return (
    <article
      className={cn(
        'max-w-[80%] h-min',
        hasComments && 'w-full lg:w-auto',
        from_type === 'user' && 'ml-auto'
      )}
    >
      {from_type === 'character' && (
        <p
          className={cn(
            'rounded-[4px] bg-white border border-neutral-gray-400',
            'whitespace-pre-wrap px-3 py-2 text-sm'
          )}
        >
          {dialogue_value}
        </p>
      )}
      {from_type === 'user' && mode === 'idle' && (
        <p
          className={cn(
            'rounded-t-[4px] lg:rounded-[4px] bg-neutral-gray-200 border-2 border-transparent',
            !hasComments && 'rounded-[4px]',
            'whitespace-pre-wrap px-3 py-2 text-sm'
          )}
        >
          {dialogue_value}
        </p>
      )}
      {from_type === 'user' && mode === 'selecting' && (
        <button
          disabled={isTranscriptSelected}
          onClick={selectTranscript}
          className={cn(
            'text-left',
            'rounded-[4px] border-2 border-transparent transition',
            'whitespace-pre-wrap px-3 py-2 text-sm',
            'bg-neutral-gray-200 hover:bg-frost-500',
            'disabled:bg-[#EADEFF] disabled:border-brandcolora'
          )}
        >
          {dialogue_value}
        </button>
      )}

      <div className='lg:hidden'>
        <CommentsCollapsible transcript={transcript} />
      </div>
    </article>
  )
}

function TranscriptScrollArea() {
  const openTranscriptCommentsStore = useOpenTranscriptCommentsStore()
  // const { mode } = useTranscriptCommentStore()
  const { transcripts } = useGetSimulationResults()

  const closeAnyOpenComments: ComponentProps<'li'>['onClick'] = (event) => {
    const { target, currentTarget } = event
    if (target !== currentTarget) return
    openTranscriptCommentsStore.setId(null)
  }

  return (
    <ScrollArea
      className='group'
      scrollbar={
        <ScrollBar
          forceMount
          className='border-0 absolute top-0 lg:!right-[40%] lg:-translate-x-[8px] transition opacity-0 group-hover:opacity-100'
          thumb={
            <ScrollThumb className='transition-colors bg-gray-200 hover:bg-gray-300' />
          }
        />
      }
    >
      <ol className='grid lg:grid-cols-[3fr_2fr] gap-x-8 lg:px-4 lg:pb-1 group'>
        <>
          {/* Placeholder to make the header appear on the second column */}
          <li className='hidden lg:block'></li>

          <li className='hidden lg:block sticky top-0 z-10 mb-4'>
            <header className='bg-neutral-gray-50/95 py-4'>
              <h3 className='font-semibold'>Notes and Learnings</h3>

              {/* <Card
                className={cn(
                  'rounded-sm py-2 px-3 bg-gradient-to-r from-[#6B7EFE] to-[#DA7AEA] text-white space-y-2 absolute overflow-hidden',
                  mode === 'selecting' && 'hidden',
                  'max-h-28 group-hover:max-h-7 hover:min-h-[100px] hover:max-h-[100px]',
                  'transition-all duration-300'
                )}
              >
                <div className='flex items-center gap-2'>
                  <Sparkle className='size-3' fill='white' />
                  <p className='text-xs tracking-wider uppercase'>AI Couch</p>
                </div>
                <p className='text-sm leading-5'>
                  You might want to take this opportunity to ask about his
                  relationships.
                </p>
              </Card> */}
            </header>
          </li>
        </>

        {transcripts.map((transcript: TranscriptType, idx: number) => (
          <Fragment key={idx}>
            <li onClick={closeAnyOpenComments} className='mb-4 lg:mb-5 flex'>
              <TranscriptDisplay transcript={transcript} />
            </li>

            <DesktopCommentsListItem transcripts={transcripts} idx={idx} />
          </Fragment>
        ))}
      </ol>
    </ScrollArea>
  )
}

function AddCommentButton() {
  const { mode, setMode, reset } = useTranscriptCommentStore()
  const { orgSlug } = useOrganization()
  const { user } = useUser()
  const currentRoleUnderOrg = user?.organizations?.find(
    (org) => org.organization.slug === orgSlug
  )?.roles[0]

  function changeMode() {
    if (mode === 'idle') setMode('selecting')
    if (mode === 'selecting') reset()
  }

  /** Using `<label>` is most appropriate here, but it seems to cause unexpected issues */
  return (
    <section className='flex items-center gap-3 group'>
      <p className='text-sm hidden group-hover:block'>
        {mode === 'idle' && <span>Add Comment</span>}
        {mode === 'selecting' && <span>Stop Commenting</span>}
      </p>

      {currentRoleUnderOrg !== roles.learner && (
        <Button
          variant='ghost'
          size='icon'
          onClick={changeMode}
          className={cn(
            'size-auto',
            'rounded-full border border-transparent p-3',
            mode === 'idle' && 'bg-white border-neutral-gray-400',
            mode === 'selecting' &&
              'bg-purple-shade-darkest2 text-white hover:bg-purple-shade-darkest2 hover:text-white'
          )}
        >
          {mode === 'idle' && <MessageCircleMore className='size-6' />}
          {mode === 'selecting' && (
            <div className='grid *:row-[1] *:col-[1]'>
              <div className='transition opacity-100 group-hover:opacity-0'>
                <MessageCircleMore className='size-6' />
              </div>
              <div className='transition opacity-0 group-hover:opacity-100'>
                <X className='size-6' />
              </div>
            </div>
          )}
        </Button>
      )}
    </section>
  )
}

function TranscriptCard() {
  const { transcripts } = useGetSimulationResults()

  const hasNoTranscripts = transcripts?.length === 0

  if (hasNoTranscripts) {
    return <p className='text-center text-neutral-gray-600'>No transcripts</p>
  }

  return (
    <div className='relative overflow-hidden lg:h-[848px] lg:border lg:border-neutral-gray-400 lg:rounded-[8px] grid *:row-[1] *:col-[1]'>
      {/* Background color for transcripts, and border separator between transcripts and comments */}
      <div className='hidden lg:block h-full w-[60%] -translate-x-[6px] bg-white border-0 border-r border-neutral-gray-400'></div>

      <TranscriptScrollArea />

      <div className='hidden lg:block absolute bottom-0 right-0 m-4'>
        <AddCommentButton />
      </div>
    </div>
  )
}

export default TranscriptCard
