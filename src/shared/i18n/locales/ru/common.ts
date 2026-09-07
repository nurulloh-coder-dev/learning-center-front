import type { CommonKeys } from '../uz/common'

/** Umumiy matnlar: tugmalar, navigatsiya, hafta kunlari, xato holatlari. (ruscha) */
export const common: Record<CommonKeys, string> = {
    'common.save': 'Сохранить',
    'common.saving': 'Сохранение…',
    'common.cancel': 'Отмена',
    'common.close': 'Закрыть',
    'common.edit': 'Изменить',
    'common.delete': 'Удалить',
    'common.downloadCsv': 'Скачать',
    'common.signOut': 'Выйти',
    'common.loading': 'Загрузка…',
    'common.empty': '—',
    'common.prev': 'Назад',
    'common.next': 'Вперёд',
    'common.pageInfo': 'Страница {{page}} из {{total}} · всего {{count}}',
    'common.somethingWrong': 'Что-то пошло не так. Попробуйте ещё раз.',
    'common.back': 'Назад',
    'common.notConnected': 'Не подключено',
    'nav.home': 'Главная',
    'nav.attendance': 'Посещаемость',
    'nav.settings': 'Настройки',
    'nav.menu': 'Меню',
    'nav.theme': 'Тема',
    'nav.theme.dark': 'Тёмная',
    'nav.theme.light': 'Светлая',
    'error.notFound': 'Страница не найдена',
    'error.notFoundHint': 'Неверный адрес или страница перемещена.',
    'pending.title': 'Backend ещё не готов',
    'pending.body':
        'Для этого блока пока нет endpoint. Интерфейс готов — как только endpoint появится, данные отобразятся здесь.',
    'pending.short': 'Нет endpoint',
}
