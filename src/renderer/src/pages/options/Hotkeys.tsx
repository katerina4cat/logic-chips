import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './Hotkeys.module.scss'
import { useNavigate } from 'react-router-dom'
import { navigate } from '@renderer/App'
import Button from '@renderer/components/Button/Button'
import { hotKeyEventListener, hotkeyInfo } from '@renderer/common/HotKeyListener'
import { beautifyKeyCode, HotKey, HotKeysInfo } from '@renderer/common/HotKey'
import TrashIcon from '@renderer/assets/trash.svg?react'
import Modal from '@renderer/components/Modal/Modal'

interface Props {}

export class HotkeysViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @observable
  hotkey: Partial<HotKeysInfo> = {}
  @observable
  ErrorDigitModal = false
  @observable
  SavedModal = false
  @action
  callback = (hotkey: HotKeysInfo) => {
    if (hotkeyInfo[this.hotkeyName].digit) {
      if ((hotkey.keyCode as string).startsWith('Digit')) hotkey.keyCode = /Digit[1-9]/
      else if ((hotkey.keyCode as string).startsWith('Numpad')) hotkey.keyCode = /Numpad[1-9]/
      else if (/^F[1-9]$/gm.test(hotkey.keyCode as string)) hotkey.keyCode = /F[1-9]/
      if (!(hotkey.keyCode instanceof RegExp)) {
        this.ErrorDigitModal = true
        return
      }
    }
    hotKeyEventListener.hotkeys[this.hotkeyName].keys[this.index] = hotkey
  }
  clear = () => {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)
    this.callback(this.hotkey as HotKeysInfo)
    this.index = -1
  }
  @action
  keyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    switch (e.code) {
      case 'AltLeft':
      case 'AltRight':
        this.hotkey.alt = true
        break
      case 'ControlLeft':
      case 'ControlRight':
        this.hotkey.ctrl = true
        break
      case 'ShiftLeft':
      case 'ShiftRight':
        this.hotkey.shift = true
        break
      default:
        this.hotkey.keyCode = e.code
        this.clear()
        break
    }
  }
  @action
  keyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    switch (e.code) {
      case 'AltLeft':
      case 'AltRight':
        this.hotkey.alt = false
        break
      case 'ControlLeft':
      case 'ControlRight':
        this.hotkey.ctrl = false
        break
      case 'ShiftLeft':
      case 'ShiftRight':
        this.hotkey.shift = false
        break
    }
  }

  @action
  startCheckHotkey = (hotkeyName: string, index: number) => {
    this.hotkeyName = hotkeyName
    this.index = index
    this.hotkey = {}
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
  }

  @action
  deleteHotkey = (hotkeyName: string, index: number) => {
    hotKeyEventListener.hotkeys[hotkeyName].keys.splice(index, 1)
  }

  @observable
  index = -1
  @observable
  hotkeyName = ''
}

const beautifyKey = (key: Partial<HotKeysInfo>) =>
  [key.ctrl && 'ctrl', key.shift && 'shift', key.alt && 'alt'].filter(Boolean).join(' + ') +
  ` ${beautifyKeyCode(key.keyCode)}`

const Hotkeys = view(HotkeysViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <>
      <div className={cl.Hotkeys}>
        <h1 className={cl.Title}>Горячии клавиши</h1>
        <div className={cl.List}>
          {Object.keys(hotKeyEventListener.hotkeys).map((hotkey) => {
            const currHt = hotKeyEventListener.hotkeys[hotkey] as HotKey
            return (
              <div className={cl.HotkeyInfo}>
                <div className={cl.Title}>
                  {hotkeyInfo[hotkey].title}
                  {hotkeyInfo[hotkey].desc ? (
                    <span title={hotkeyInfo[hotkey].desc} className={cl.Hint}>
                      ?
                    </span>
                  ) : undefined}
                </div>
                <div className={cl.ChangeButtons}>
                  {currHt.keys.map((key, index) => (
                    <Button
                      className={cl.Btn}
                      onClick={() => viewModel.startCheckHotkey(hotkey, index)}
                    >
                      <div className={cl.KeyInfo}>
                        {beautifyKey(
                          index === viewModel.index && hotkey === viewModel.hotkeyName
                            ? viewModel.hotkey
                            : key
                        )}
                      </div>
                      <TrashIcon
                        className={cl.TrashIcon}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          viewModel.deleteHotkey(hotkey, index)
                        }}
                      />
                    </Button>
                  ))}
                  {currHt.keys.length < 3 ? (
                    <Button
                      onClick={action((e) => {
                        e.currentTarget.blur()
                        viewModel.startCheckHotkey(hotkey, currHt.keys.length)
                        currHt.keys.push({ keyCode: 'Ø' })
                      })}
                      customtype="Submit"
                      style={{ gridArea: '1 / 3 / 2 / 4' }}
                    >
                      Добавить
                    </Button>
                  ) : undefined}
                </div>
              </div>
            )
          })}
        </div>
        <div className={cl.Buttons}>
          <Button
            className={cl.Btn}
            onClick={action(() => {
              hotKeyEventListener.saveCurrentSettings()
              viewModel.SavedModal = true
            })}
          >
            Сохранить
          </Button>
          <Button className={cl.Btn} onClick={() => navigate.current(-1)}>
            Назад
          </Button>
        </div>
      </div>
      <Modal
        enabled={viewModel.ErrorDigitModal}
        setenabled={action((v) => {
          viewModel.ErrorDigitModal = v
        })}
        className={cl.ErrorMsg}
      >
        <h2 className={cl.ErrTitle}>Ошибка!</h2>
        <div>
          Назначение данного действия возможно только на цифровую клавиатуру с цифрами,
          алфавитно-цифровые клавиши с цифрами или функциональные клавиши!
        </div>
        <div className={cl.Buttons}>
          <Button
            customtype="Submit"
            onClick={action(() => {
              viewModel.ErrorDigitModal = false
            })}
          >
            Ок
          </Button>
        </div>
      </Modal>
      <Modal
        enabled={viewModel.SavedModal}
        setenabled={action((v) => {
          viewModel.SavedModal = v
          navigate.current(-1)
        })}
        className={cl.ErrorMsg}
      >
        <h2 className={cl.SuccTitle}>Сохранено!</h2>
        <div>Горячии клавиши успешно применены.</div>
        <div className={cl.Buttons}>
          <Button
            customtype="Submit"
            onClick={action(() => {
              viewModel.SavedModal = false
              navigate.current(-1)
            })}
          >
            Ок
          </Button>
        </div>
      </Modal>
    </>
  )
})

export default Hotkeys
