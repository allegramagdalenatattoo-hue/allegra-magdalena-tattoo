<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use the shared PhotoViewer for public photo galleries so enlargement, keyboard navigation, and touch navigation stay consistent without changing stored photo metadata.
- Keep Flash categories in one shared catalog for public galleries, admin selectors, photo section slugs, and the sitemap; new categories start empty with optional covers rather than invented drawings.
- Render desktop and mobile Flash navigation through the same catalog-driven dropdown in SiteShell so category links stay consistent and keyboard-accessible.
- Keep exported gallery files in public/photos with a typed snapshot catalog; Vercel or explicit static-photo mode reads that snapshot without Cloud access, while Cloud retains live photo administration and resolves exported photo IDs to local URLs.
- Keep decorative GIFs in public/gifs and reference their static paths so animation works on Vercel without Lovable asset serving.
