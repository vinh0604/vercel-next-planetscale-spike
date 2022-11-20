# MerPad

## Setup

### Prerequistes
asdf (https://asdf-vm.com/)
Vercel (https://vercel.com/)
PlanetScale & CLI (https://planetscale.com/features/cli)

### Environment
Copy `.env.sample` to `.env` and update environment variables accordingly.

```
asdf install
yarn
```

### Database
```sh
pscale org switch <org_name>
pscale connect marpad main --port 3309

npx prisma db pull
npx prisma generate
npx prisma db push
```

### Code
```
yarn dev
```

## Troubleshooting

### Database
```sh
pscale shell marpad-database main
```