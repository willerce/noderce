if (!(jQuery.browser.msie == true && parseInt(jQuery.browser.version) < 9)) {
	function beforeImgLoad(b) {
		var a = function() {
				if (arguments.callee.done) return;
				arguments.callee.done = true;
				b.apply(document, arguments)
			};
		if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, false);
		else if (jQuery.browser.webkit) var d = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				clearInterval(d);
				a()
			}
		}, 10);
		else if (jQuery.browser.msie) {
			document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
			var c = document.getElementById("__ie_onload");
			c.onreadystatechange = function() {
				this.readyState == "complete" && a()
			}
		}
		return true
	}
	function hoverdirCallback() {
		jQuery("li.imageblock .gallerylayout").length > 0 && jQuery("li.imageblock .gallerylayout").hoverdir();
		jQuery("span.da-thumbs-con").each(function() {
			var a = jQuery(this).height(),
				b = -(a / 2);
			jQuery(this).css("margin-top", +b)
		})
	}
	beforeImgLoad(function() {
		jQuery('li.item > div, li.item > a[class!="thumbwrap"], li.item > .gallerylayout').css("background", smallBlockBg)
	});
	jQuery(document).ready(function() {
		jQuery("audio").length > 0 && jQuery("audio").mediaelementplayer({
			alwaysShowControls: false,
			audioHeight: 80,
			loop: true,
			startVolume: .8,
			alwaysShowHours: true,
			features: ["playpause", "progress", "current"]
		});
		jQuery("#top").hide();
		jQuery(function() {
			jQuery(window).scroll(function() {
				if (jQuery(window).scrollTop() > 100) jQuery("#top").fadeIn(300);
				else jQuery("#top").fadeOut(100)
			});
			jQuery("#top").click(function() {
				jQuery("body,html").animate({
					scrollTop: 0
				}, 500);
				return false
			})
		});
		jQuery("#supersized").length > 0 && jQuery(window).resize(function() {
			jQuery('#supersized,#controls-wrapper').css({
				height: jQuery(window).height()
			});
			jQuery('#prevslide, #nextslide, #progress-back ').css({
				top: jQuery(window).height()
			});
			if (jQuery(".sidebar_right").length > 0) {
				jQuery('.sidebar_right').css({
					top: jQuery(window).height() + 40
				})
			}
			jQuery('#item-wrap,#single-wrap').css({
				marginTop: jQuery(window).height()
			});
			if (jQuery(window).width() < 768) {
				jQuery('#siderbar').css('position', 'absolute')
			} else {
				jQuery('#siderbar').css('position', 'fixed')
			}
			if (jQuery(window).width() < 768) {
				jQuery('#logo img,#logo_retina img').css('height', '90px').css('width', 'auto')
			} else {
				jQuery('#logo img,#logo_retina img').css('height', 'auto').css('width', 'auto')
			}
		}).trigger("resize");
		if (jQuery(".image-wrap-slider").length > 0) {
			var j = jQuery('input[name="trans"]').val(),
				k = jQuery('input[name="crop"]').val(),
				g = jQuery('input[name="autoplay"]').val();
			jQuery(".image-wrap-slider").galleria({
				idleMode: false,
				autoplay: g,
				preload: 5,
				showInfo: false,
				showCounter: true,
				transition: j,
				thumbnails: false,
				responsive: true,
				imageCrop: k
			})
		}
		jQuery("#navi>ul>li>ul").each(function() {
			jQuery(this).siblings("a").append('<span class="dot"></span>')
		});
		jQuery("#navi>ul>li").has("ul").each(function() {
			var a = jQuery("#navi>ul>li");
			a.children(".sub-menu").hide();
			a.hoverIntent({
				over: b,
				timeout: 100,
				out: c
			});

			function b() {
				jQuery(this).children(".sub-menu").stop(true, false).animate({
					opacity: "1"
				}, 330);
				jQuery(this).children(".sub-menu").show()
			}
			function c() {
				jQuery(this).children(".sub-menu").stop(true, false).animate({
					opacity: "0"
				}, 100);
				jQuery(this).children(".sub-menu").hide()
			}
			a.find("li").hover(function() {
				jQuery(this).children("ul.sub-menu").slideDown(200)
			}, function() {
				jQuery(this).children("ul.sub-menu").slideUp(100)
			})
		});

		function f() {
			var b = parseInt(jQuery('input[name="mapzoom"]').val()),
				a = jQuery('input[name="location"]').val(),
				c = jQuery('input[name="maptype"]').val();
			jQuery("#map_canvas").gmap({
				center: a,
				zoom: b,
				mapTypeControl: true,
				mapTypeId: google.maps.MapTypeId.maptype,
				mapTypeControlOptions: {
					position: google.maps.ControlPosition.TOP_RIGHT,
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
				},
				OTHER_PARAMS: "OTHER_VALUE",
				callback: function() {
					var a = this;
					a.addMarker({
						position: this.get("map").getCenter()
					})
				}
			})
		}
		jQuery(window).width() < 767 && jQuery(".fixed_column").css("width", "95%");
		var a = window.$container = jQuery("#item-wrap"),
			c = parseInt(window.blockWidth || 260),
			d = parseInt(window.blockColumn || 2),
			b = parseInt(window.blockMargin || 10);
		jQuery("head").append("<style>#item-wrap li.item{margin-top:" + b + "px;margin-right:" + b + "px;}</style>");
		a.css({
			paddingLeft: b + "px"
		});
		jQuery(".bottom_hasspace").length == 0 && a.css({
			paddingBottom: b + "px"
		});
		a.find("li.item img").hide();
		a.find("li.item a").css({
			cursor: "default"
		});
		a.find("li.item").width(c);

		function h() {
			if (jQuery.browser.webkit) a.isotope({
				animationEngine: "css",
				itemSelector: ".item",
				baseWidth: c,
				useColumns: d,
				masonry: {
					columnWidth: c + b
				}
			}, hoverdirCallback);
			else a.isotope({
				animationEngine: "jquery",
				itemSelector: ".item",
				baseWidth: c,
				useColumns: d,
				masonry: {
					columnWidth: c + b
				}
			}, hoverdirCallback)
		}
		var l = function() {
				var c = this;
				c.onAnimate = function() {};
				var e = a;
				c.cfg = {
					selector: 'li[rel] [act="zoom"]',
					evt: "click",
					fadeSpeed: "",
					marginX: b,
					closeHtml: "<span class=close_ajax></span>",
					loadHtml: "<span class=loading_ajax></span>",
					useColumns: d
				};
				var s = [],
					r = [],
					t = false;

				function p(e) {
					var c = parseInt(e.offset().top - b),
						a = parseInt(jQuery(document).scrollTop()),
						d;
					if (c > a) d = setInterval(function() {
						if (a >= c) {
							clearInterval(d);
							jQuery(document).scrollTop(c);
							return
						} else jQuery(document).scrollTop(a += 10)
					}, 15);
					else d = setInterval(function() {
						if (a <= c) {
							clearInterval(d);
							jQuery(document).scrollTop(c);
							return
						} else jQuery(document).scrollTop(a -= 10)
					}, 15)
				}
				function h(a, b) {
					h.cache = h.cache || {};
					if (h.cache[escape(a)]) b(h.cache[escape(a)]);
					else jQuery.ajax({
						type: "get",
						dataType: "text",
						url: a,
						error: function() {
							alert("load error")
						},
						success: function(c) {
							h.cache[escape(a)] = c;
							b(h.cache[escape(a)])
						}
					})
				}
				var k = [],
					m = false,
					l = false,
					n = false,
					i = false,
					q = false,
					j = [],
					o = false;
				this.close = function(f, h) {
					var o = j.length;
					if (o > 0) {
						for (var g = 0; g < o; g++) typeof j[g] != "undefined" && clearTimeout(j[g]);
						j = []
					}
					var b = k[f];
					if (!b) return;
					l = true;
					i = f;
					var a = b.box,
						r = b.bw,
						p = b.height,
						d = jQuery("#queue" + f),
						m = jQuery('li[pid="' + f + '"]');
					d.css({
						height: m.height(),
						width: m.width()
					}).show();
					a.fadeOut(c.cfg.fadeSpeed, function() {
						a.html(b.html);
						a.width(r);
						var f = '<li id="li_b"></li>';
						a.after(f);
						f = jQuery("#li_b");
						f.attr("class", a.attr("class"));
						f[0].style.cssText = a[0].style.cssText;
						f.css({
							zIndex: a.css("z-index") - 1
						});
						f.css({
							background: smallBlockBg,
							height: p,
							display: "block"
						});
						d.animate({
							width: r + "px",
							height: p + "px",
							backgroundColor: smallBlockBg
						}, 800, function() {
							l = false;
							i = false;
							q = false;
							a.css("background", smallBlockBg).fadeIn(c.cfg.fadeSpeed, function() {
								f.remove()
							})
						});
						e.isotope("reLayout", function() {
							d.remove();
							d = null;
							h && h()
						}, function() {
							var b = jQuery("#queue" + n);
							return [d, a, b, e.find('[pid="' + n + '"]')]
						}());
						jQuery(".da-thumbs .gallerylayout a div").removeClass("da-slideLeft").addClass("da-slideFromLeft");
						jQuery("li.imageblock .gallerylayout").hoverdir()
					})
				};
				this.open = function(a) {
					var r = a.attr("rel");
					if (r) {
						m = true;
						var d = false;
						jQuery.each(k, function(b, c) {
							if (c.box[0] == a[0]) {
								d = b;
								return false
							}
						});
						if (d === false) d = k.push({
							html: a.html(),
							box: a,
							height: a.height(),
							bw: a.width()
						}) - 1;
						n = d;
						q = d;
						a.attr("pid", d);
						var g, s = a.width() * c.useColumns() + c.cfg.marginX * (c.useColumns() - 1),
							b = '<li id="queue' + d + '"></li>';
						a.after(b);
						b = jQuery("#queue" + d);
						b[0].style.cssText = a[0].style.cssText;
						b.attr("class", a.attr("class"));
						b.css({
							zIndex: a.css("z-index") - 1
						});
						b.css({
							width: a.width(),
							height: a.height(),
							background: smallBlockBg
						});

						function l() {
							b.html("");
							a.height("");
							a.html(g);
							a.width(s);
							var n = a.height();
							b.animate({
								width: s,
								height: n,
								backgroundColor: bigBlockBg
							}, 800, function() {
								m = false
							});
							var h = function() {
									e.isotope("reLayout", function() {}, function() {
										var c = jQuery("#queue" + i);
										return [b, a, c, e.find('[pid="' + i + '"]')]
									})
								};
							a.css("background", bigBlockBg);
							e.isotope("reLayout", function() {
								b.css({
									height: a.height(),
									width: a.width()
								});
								var j = e.data("isotope").options.ex;
								a.fadeIn(c.cfg.fadeSpeed, function() {
									p(a)
								});
								if (!o) {
									var i = jQuery('<span action="close" pid ="' + d + '" style="cursor:pointer;background:#f3f3f3;position:absolute;">' + c.cfg.closeHtml + "</span>");
									i.appendTo(a);
									i.css({
										top: "8px",
										right: "10px"
									});
									var g = jQuery('<span action="close" pid ="' + d + '" style="cursor:pointer;background:#f3f3f3;position:absolute;transform: rotate(90deg);-webkit-transform:rotate(90deg);-moz-transform: rotate(90deg);-ms-transform: rotate(90deg);-o-transform:rotate(90deg);">' + c.cfg.closeHtml + "</span>");
									g.appendTo(a);
									g.css({
										bottom: "10px",
										right: "8px"
									})
								}
								setTimeout(function() {
									var c = function() {
											b.height(a.height());
											h()
										};
									window.commitInitAjax && commitInitAjax($, c);
									jQuery("audio").length > 0 && jQuery("audio").mediaelementplayer({
										alwaysShowControls: false,
										audioHeight: 80,
										loop: true,
										startVolume: .8,
										alwaysShowHours: true,
										features: ["playpause", "progress", "current"]
									});
									jQuery("#map_canvas").length > 0 && f();
									if (jQuery(".image-wrap-slider").length > 0) {
										var e = jQuery('input[name="trans"]').val(),
											g = jQuery('input[name="crop"]').val(),
											d = jQuery('input[name="autoplay"]').val();
										jQuery(".image-wrap-slider").galleria({
											idleMode: false,
											autoplay: d,
											preload: 5,
											showInfo: false,
											showCounter: true,
											transition: e,
											thumbnails: false,
											responsive: true,
											imageCrop: g
										})
									}
								})
							}, function() {
								var c = jQuery("#queue" + i);
								return [b, a, c, e.find('[pid="' + i + '"]')]
							}());
							if (jQuery(".image-wrap-slider").length > 0) {
								var k = jQuery('input[name="trans"]').val(),
									l = jQuery('input[name="crop"]').val(),
									j = jQuery('input[name="autoplay"]').val();
								jQuery(".image-wrap-slider").galleria({
									idleMode: false,
									autoplay: j,
									preload: 5,
									showInfo: false,
									showCounter: true,
									transition: k,
									thumbnails: false,
									responsive: true,
									imageCrop: l
								})
							}
						}
						h(r, function(h) {
							var a = jQuery(h).find("#single-wrap"),
								f = a.clone(true).html(),
								b = a.find("img").hide();
							g = a.html();
							var e = setTimeout(l, 300);
							if (b.length > 0) {
								o = true;
								g = a.html();
								j[d] = setTimeout(function() {}, 3e4);
								var i = b.attr("src"),
									c = new Image;
								b.imagesLoaded(function() {
									c.onload = c.onerror = function() {
										if (j[d]) {
											o = false;
											clearTimeout(e);
											e = null;
											g = f;
											l()
										}
									};
									c.src = i
								})
							}
						});
						a.fadeOut("fast", function() {
							b.html(c.cfg.loadHtml);
							b.css({
								lineHeight: b.height() + "px"
							})
						});
						return d
					}
				};
				var g = {};
				this.useColumns = function() {
					var a = jQuery.data(e[0], "isotope");
					return a ? Math.min(a.masonry.cols, c.cfg.useColumns) : c.cfg.useColumns
				};
				this.init = function() {
					e.find("li.item a").css({
						cursor: "pointer"
					});
					jQuery(window).bind("resize", function() {
						var b = e.find('[action="close"]:eq(0)');
						if (b.length > 0) {
							var a = b.attr("pid");
							c.close(a, function() {
								var b = k[a];
								if (!b) return;
								e.isotope("reLayout")
							});
							g[a] = null;
							delete g[a];
							return false
						} else e.isotope("reLayout")
					});
					e.on("click", 'span[action="close"]', function() {
						var a = jQuery(this).attr("pid");
						c.close(a, function() {
							var b = k[a];
							if (!b) return;
							var c = b.box;
							p(c)
						});
						g[a] = null;
						delete g[a];
						return false
					});
					e.on(c.cfg.evt, c.cfg.selector, function(e) {
						if (m || l) return;
						e.preventDefault();
						var b = false,
							a = jQuery(this).parents("[rel]");
						if (jQuery.browser.msie == true && parseInt(jQuery.browser.version) < 9) {
							document.location.href = a.attr("rel");
							return
						}
						if (a.length == 0) return;
						jQuery.each(g, function(e, d) {
							if (d) if (d[0] == a[0]) b = true;
							else {
								c.close(d.attr("pid"));
								g[d.attr("pid")] = null;
								delete g[d.attr("pid")];
								return false
							}
						});
						if (b) return;
						var d = c.open(a);
						g[d] = a;
						return false
					})
				}
			};
		a.imagesLoaded(function() {
			h();
			jQuery(".tw_style").fadeIn("normal");
			var a = new l;
			a.init()
		});
		var e = a.find("img"),
			n = e.length,
			m = 0;
		e.each(function(b, a) {
			a.onload = a.onerror = function() {
				jQuery(this).fadeIn("fast")
			}
		});
		jQuery("#filterable a").click(function() {
			jQuery(".close_ajax").trigger("click");
			jQuery(this).css("outline", "none");
			jQuery("#filterable").find("li").removeClass("current");
			jQuery(this).parent().addClass("current");
			var b = jQuery(this).attr("data-filter");
			a.isotope({
				filter: b
			});
			return false
		});
		(function() {
			var a = 0;
			jQuery.fn.mobileMenu = function(f) {
				var b = {
					switchWidth: 757,
					topOptionText: "Menu",
					indentString: "---"
				};

				function l(a) {
					return a.is("ul, ol")
				}
				function d() {
					return jQuery(window).width() < b.switchWidth
				}
				function c(b) {
					if (b.attr("id")) return jQuery("#mobileMenu_" + b.attr("id")).length > 0;
					else {
						a++;
						b.attr("id", "mm" + a);
						return jQuery("#mobileMenu_mm" + a).length > 0
					}
				}
				function j(a) {
					if (a.val() !== null) document.location.href = a.val()
				}
				function e(a) {
					a.css("display", "none");
					jQuery("#mobileMenu_" + a.attr("id")).show()
				}
				function k(a) {
					a.css("display", "");
					jQuery("#mobileMenu_" + a.attr("id")).hide()
				}
				function h(a) {
					if (l(a)) {
						var c = '<select id="mobileMenu_' + a.attr("id") + '" class="mobileMenu">';
						c += '<option value="">' + b.topOptionText + "</option>";
						a.find("li").each(function() {
							var a = "",
								f = jQuery(this).parents("ul, ol").length;
							for (i = 1; i < f; i++) a += b.indentString;
							var d = jQuery(this).find("a").attr("href"),
								e = a + jQuery(this).clone().find("ul, ol, span").remove().end().text();
							c += '<option value="' + d + '">' + e + "</option>"
						});
						c += "</select>";
						a.parent().append(c);
						jQuery("#mobileMenu_" + a.attr("id")).change(function() {
							j(jQuery(this))
						});
						e(a)
					} else alert("mobileMenu will only work with UL or OL elements!")
				}
				function g(a) {
					if (d() && !c(a)) h(a);
					else if (d() && c(a)) e(a);
					else!d() && c(a) && k(a)
				}
				return this.each(function() {
					f && jQuery.extend(b, f);
					var a = jQuery(this);
					jQuery(window).resize(function() {
						g(a)
					});
					g(a)
				})
			}
		})(jQuery);
		jQuery("#navi ul.menu").mobileMenu()
	})
}